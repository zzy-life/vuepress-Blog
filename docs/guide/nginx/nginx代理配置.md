# Nginx代理配置


## vue代理

```nginx
user www www;
worker_processes auto;
error_log /www/wwwlogs/nginx_error.log crit;
pid /www/server/nginx/logs/nginx.pid;
worker_rlimit_nofile 51200;

events {
    use epoll;
    worker_connections 51200;
    multi_accept on;
}

http {
    #设置限制单IP访问速度
    limit_req_zone $binary_remote_addr zone=one:10m rate=30r/s;
    include mime.types;
    #include luawaf.conf;

    include proxy.conf;

    default_type application/octet-stream;

    server_names_hash_bucket_size 512;
    client_header_buffer_size 32k;
    large_client_header_buffers 4 32k;
    client_max_body_size 50m;

    sendfile on;
    tcp_nopush on;

    keepalive_timeout 60;

    tcp_nodelay on;

    fastcgi_connect_timeout 300;
    fastcgi_send_timeout 300;
    fastcgi_read_timeout 300;
    fastcgi_buffer_size 64k;
    fastcgi_buffers 4 64k;
    fastcgi_busy_buffers_size 128k;
    fastcgi_temp_file_write_size 256k;
    fastcgi_intercept_errors on;

    # 开启gzip压缩
    gzip on;
    # 不压缩临界值，大于1K的才压缩，一般不用改
    gzip_min_length 1k;
    # 压缩缓冲区
    gzip_buffers 16 64K;
    # 压缩版本（默认1.1，前端如果是squid2.5请使用1.0）
    gzip_http_version 1.1;
    # 压缩级别，1-10，数字越大压缩的越好，时间也越长
    gzip_comp_level 5;
    # 进行压缩的文件类型
    gzip_types text/plain application/x-javascript text/css application/xml application/javascript;
    # 跟Squid等缓存服务有关，on的话会在Header里增加"Vary: Accept-Encoding"
    gzip_vary on;
    # IE6对Gzip不怎么友好，不给它Gzip了
    gzip_disable "MSIE [1-6]\.";

    limit_conn_zone $binary_remote_addr zone=perip:10m;
    limit_conn_zone $server_name zone=perserver:10m;

    server_tokens off;
    access_log off;

    upstream blog {
        #负载均衡
        #server 39.98.113.96:8088 weight=1; #权重
        server 127.0.0.1:8090 weight=1;
    }
    server {
        listen 8900;
        server_name localhost;
        charset utf-8,gbk;
        #error_page   404   /404.html;
        include enable-php.conf;

        set $is_mobile no;
        if ($http_user_agent ~* "(mobile|nokia|iphone|ipad|android|samsung|htc|blackberry)") {
            set $is_mobile yes;
        }

        location / {
            #配置根项目
            #限制单IP访问速度
            limit_req zone=one burst=50 nodelay;

            if ($is_mobile = "no") {
                root /www/wwwroot/Ruoyi/p/dist;#根项目地址
            }
            if ($is_mobile = "yes") {
                root /www/wwwroot/Ruoyi/m/dist;#根项目地址
            }
            try_files $uri $uri/ /index.html =404;
            index index.html index.htm;
            ssi on;
        }

        location /xyw {
            #配置根项目
            #限制单IP访问速度
            limit_req zone=one burst=50 nodelay;
            if ($is_mobile = "no") {
                rewrite ^/(.*)$
                http://www.zhangzhiyu.live:8900/xyw/computer break ;
            }
            if ($is_mobile = "yes") {
                rewrite ^/(.*)$
                http://www.zhangzhiyu.live:8900/xyw/mobile
                break ;
            }
            try_files $uri $uri/ /index.html =404;
            index index.html index.htm;
            ssi on;
        }

        location /xyw/computer {
            #配置PC端项目
            #限制单IP访问速度
            limit_req zone=one burst=50 nodelay;

            alias //www/wwwroot/Ruoyi/p/dist;#PC端项目地址
            try_files $uri $uri/ /xyw/computer/index.html;#后台路由管理
            #try_files $uri $uri/ /index.html;
            index index.html index.htm;
        }


        location /xyw/mobile {
            #配置移动端项目
            #限制单IP访问速度
            limit_req zone=one burst=50 nodelay;

            alias //www/wwwroot/Ruoyi/m/dist;#移动端项目地址
            try_files $uri $uri/ /xyw/mobile/index.html;#后台路由管理
            #try_files $uri $uri/ /index.html;
            index index.html index.htm;
        }


        location /xyw/admin {
            #配置管理后台项目
            alias //www/wwwroot/Ruoyi/dist/;#管理后台地址
            try_files $uri $uri/ /xyw/admin/index.html;#后台路由管理
            #try_files $uri $uri/ /index.html;
            index index.html index.htm;
        }


        location /ddisk {
            #配置网盘项目
            #限制单IP访问速度
            limit_req zone=one burst=50 nodelay;

            alias //db/dist;#项目地址
            try_files $uri $uri/ /ddisk/index.html;#后台路由管理
            #try_files $uri $uri/ /index.html;
            index index.html index.htm;
        }

        location /vuepress {
            #配置博客项目
            #限制单IP访问速度
            limit_req zone=one burst=50 nodelay;
            charset "utf-8,gbk";
            alias //www/wwwroot/vuepress/dist;#项目地址
            try_files $uri $uri/ /vuepress/index.html;#后台路由管理
            #try_files $uri $uri/ /index.html;
            index index.html index.htm;
        }

        location /ddisk/api/ {
            #配置网盘后端
            proxy_set_header Host $http_host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header REMOTE-HOST $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_pass http://localhost:8848/;
        }

        location @router {
            # 1.静态资源，去掉项目名，进行定向 \为转义， nginx 中的 / 不代表正则，所以不需要转义
            rewrite (static/.*)$ /$1 redirect;
            # 2.非静态资源，直接定向index.html
            rewrite ^.*$ /index.html last;
        }

        location /xyw/prod-api/ {
            proxy_set_header Host $http_host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header REMOTE-HOST $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_pass http://localhost:8088/;
        }
        location /xyw/dev-api/ {
            proxy_set_header Host $http_host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header REMOTE-HOST $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_pass http://localhost:8088/;
        }
        location /xyw/profile/ {
            # 方式二：指向目录，对应后台`application.yml`中的`profile`配置
            alias /home/ruoyi/uploadPath/;
        }


        location /captchaImage {
            #验证码图片设置
            # 方式一：指向地址
            proxy_pass http://localhost:8088;
        }
        location /xyw/ueditor {
            #富文本设置
            proxy_set_header Host $http_host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header REMOTE-HOST $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            # 方式一：指向地址
            proxy_pass http://localhost:8088/ueditor;
        }

        location /xyw/api {
            proxy_set_header Host $http_host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header REMOTE-HOST $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_pass http://localhost:8088/api;
        }

        location /xyw/system {
            proxy_set_header Host $http_host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header REMOTE-HOST $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_pass http://localhost:8088/system;
        }

        location /xyw/common {
            proxy_set_header Host $http_host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header REMOTE-HOST $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_pass http://localhost:8088/common;
        }


        error_page 500 502 503 504 /50x.html;
        location = /50x.html {
            root html;
        }

        access_log /www/wwwlogs/access.log;
    }
    include /www/server/panel/vhost/nginx/*.conf;
}




```

## nginx配置文件格式化

> 工具箱 https://www.dute.org/nginx-config-formatter

