# 使用docker启动nacos

> 使用docker启动nacos



## 使用docker下载nacos

```
docker pull nacos/nacos-server:v2.1.0-slim
```

## 新建application.properties

```properties
spring.datasource.platform=mysql
db.num=1
db.url.0=jdbc:mysql://172.17.0.1:3306/nacos库?characterEncoding=utf-8&serverTimezone=Asia/Shanghai&useSSL=false
db.user="账号"
db.password="密码"

nacos.naming.empty-service.auto-clean=true
nacos.naming.empty-service.clean.initial-delay-ms=50000
nacos.naming.empty-service.clean.period-time-ms=30000

management.endpoints.web.exposure.include=*

management.metrics.export.elastic.enabled=false
management.metrics.export.influx.enabled=false

server.tomcat.accesslog.enabled=true
server.tomcat.accesslog.pattern=%h %l %u %t "%r" %s %b %D %{User-Agent}i %{Request-Source}i

server.tomcat.basedir=

nacos.security.ignore.urls=/,/error,/**/*.css,/**/*.js,/**/*.html,/**/*.map,/**/*.svg,/**/*.png,/**/*.ico,/console-ui/public/**,/v1/auth/**,/v1/console/health/**,/actuator/**,/v1/console/server/**

nacos.core.auth.system.type=nacos
nacos.core.auth.enabled=false
nacos.core.auth.default.token.expire.seconds=18000
nacos.core.auth.default.token.secret.key=SecretKey012345678901234567890123456789012345678901234567890123456789
nacos.core.auth.caching.enabled=true
nacos.core.auth.enable.userAgentAuthWhite=false
nacos.core.auth.server.identity.key=serverIdentity
nacos.core.auth.server.identity.value=security

nacos.istio.mcp.server.enabled=false


```

> 注意docker容器内网络状态  127.0.0.1可能指的是容器内的网段

## 新建logs文件夹

## 运行启动命令

```
docker  run \
--name nacos -d \
-p 8848:8848 \
-p 9848:9848 \
-p 9849:9849 \
--privileged=true \
--restart=always \
-e JVM_XMS=256m \
-e JVM_XMX=256m \
-e MODE=standalone \
-e PREFER_HOST_MODE=hostname \
-v /db/Nacos/logs:/home/nacos/logs \
-v /db/Nacos/pro/application.properties:/home/nacos/conf/application.properties \
nacos/nacos-server:v2.1.0-slim
```

