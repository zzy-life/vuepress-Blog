# docker下载和发布镜像及常用命令

Docker 支持以下的 64 位 CentOS 版本：

- CentOS 7
- CentOS 8
- 更高版本...

## 使用官方安装脚本自动安装

安装命令如下：

```bash
curl -fsSL https://get.docker.com | bash -s docker --mirror Aliyun
```

也可以使用国内 daocloud 一键安装命令：

```bash
curl -sSL https://get.daocloud.io/docker | sh
```

检测是否安装成功：

 docker version

## 启动docker

```bash
systemctl start docker
```

## springboot项目打包

### 打成jar包

### 制作Dockerfile

```bash
# 使用 AdoptOpenJDK 作为基础镜像
# https://hub.docker.com/r/adoptopenjdk/openjdk8
# https://docs.docker.com/develop/develop-images/multistage-build/#use-multi-stage-builds
FROM java:8
# 将 jar 放入容器内
COPY workflow-admin.jar /workflow-admin.jar
# 启动服务
CMD ["java", "-Djava.security.egd=file:/dev/./urandom", "-jar", "/workflow-admin.jar"]
```

## 查看镜像

```bash
docker images
```



## 制作镜像

将jar包和dockerfile传送到服务器同一文件夹内

输入:

workflow-admin是镜像名

```bash
docker build -t workflow-admin .
```

 制作完成后通过**docker images**命令查看我们制作的镜像 

## 删除镜像

```bash
docker rmi -f workflow-admin:latest
```

workflow-admin镜像名

latest 镜像TAG

> 注意镜像依赖，如果有镜像2根据镜像1生成的，则需要先删除镜像2

## 运行镜像

```bash
docker run -d -p 8080:8085 springbootdemo4docker
-d参数是让容器后台运行 
-p 是做端口映射，此时将服务器中的8080端口映射到容器中的8085(项目中端口配置的是8085)端口
springbootdemo4docker 镜像名
```
## 删除缓存

```bash
docker system prune --volumes
```

## 将镜像导出到本地

```shell
docker save -o 要保存的文件名 要保存的镜像
```

栗子

```shell
docker save -o d://docker/images/fastdfs.tar zl/fastdfs
```

## 将本地镜像压缩包导入

```shell
docker load --input 文件
```

## 查看容器

```shell
docker ps
```

## 关闭容器

```shell
 docker stop id
```

## 关闭未运行的容器

```shell
 docker rm $(docker ps -a -q)
```

## 进入容器

```shell
docker exec -it id /bin/bash
```

##  查看容器列表

```shell
docker ps -n5
```

## 删除容器

```shell
docker rm id
```



<script>
export default {
    mounted () {
      this.$page.lastUpdated = "2022/1/14 下午6:09:09";
    }
  }
</script>
