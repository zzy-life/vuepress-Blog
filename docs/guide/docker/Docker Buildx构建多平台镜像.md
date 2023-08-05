# Docker Buildx构建多平台镜像

> 使用Docker Buildx构建多平台镜像

推荐使用 Ubuntu 系统 

Centos系统可能有问题

## 安装qemu-user-static

> qemu-user-static 用来模拟多平台环境，它依赖于binfmt-support，所以这两者都要安装。

```shell
sudo apt install -y qemu-user-static binfmt-support
```

### 通知Docker使用qemu

```shell
docker run --rm --privileged multiarch/qemu-user-static --reset -p yes
```

### 创建Buildx构建容器

```shell
#创建构建容器
docker buildx create --name mybuilder
#buildx使用构建容器
docker buildx use mybuilder
#初始化构建容器
docker buildx inspect --bootstrap
```

## 构建指定架构镜像

 构建并导出到本地Docker images中 

```shell
docker buildx build -t 镜像仓库地址/镜像名:TAG --platform linux/arm64 . --load
```

## 常见问题

建议把docker的内存（ memory  ）和交换区提高，否则镜像过大可能构建失败

