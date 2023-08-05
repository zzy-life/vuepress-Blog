# node-sass安装报错

> node-sass安装报错

## 卸载 node-sass

```bash
npm uninstall node-sass
```



## 安装 sass

```bash
npm install sass@~1.32.6 --save-dev
```

 如果项目之前用到/deep/需要替换为::v-deep，否则会报错，全局搜索 /deep/ , 将项目里的 /deep/ 替换为 ::v-deep 



 **选择dart-sass的理由** [官网](https://sass.bootcss.com/guide) 

1. Sass 是一种 CSS 的预编译语言。它提供了 变量（variables）、嵌套（nested rules）、 混合（mixins）、
    函数（functions）等功能，并且完全兼容 CSS 语法。Sass 能够帮助复杂的样式表更有条理， 并且易于
    在项目内部或跨项目共享设计。
 2. 在 v4.3.0之前本项目都是基于node-sass进行构建的，但node-sass底层依赖 libsass，导致很多用户安装
    的特别的困难，尤其是 windows用户，它强制用户在windows环境中必须安装python2和Visual Studio才
    能编译成功。 所以为了解决这个问题，本项目在v4.3.0修改为dart-sass进行构建，它能在保证性能的前
    提下大大简化用户的安装成本。通过这个issue下面相关的评论就可以知道，安装 node-sass 是多么麻烦 的
    一件事。
 3. 这里选择使用dart-sass还有一个更主要的原因，sass官方已经将dart-sass作为未来主要的的开发方向了 
    ，有任何新功能它都是会优先支持的，而且它已经在社区里稳定运行了很长的一段时间，基本没有什么 
    坑了。dart-sass之所以容易安装，主要是因为它会被编译成纯 js，这样就可以直接在的 node 环境中使用 
    。虽然这样它的运行速度会比基于 libsass的慢一些些，但这些速度的差异几乎可以忽略不计。整个社区 
    现在都在拥抱dart-sass，我们没有理由拒绝！而且它的确大大简化了用户的安装成本。


 **不选择node-sass的理由**，[弃用背景](https://blog.csdn.net/weixin_46476460/article/details/112312929) 

1. node-sass在npm安装的时候大概率的会安装出错，或下载时间过长，因此考虑用dart-sass来替换
2. node-sass已经停止更新 

 **node-sass与dart-sass区别** 

1. node-sass 是用 node(调用 cpp 编写的 libsass)来编译 sass；
 2. dart-sass 是用 drat VM 来编译 sass；
 3. node-sass是自动编译实时的，dart-sass需要保存后才会生效
 4. 推荐 dart-sass 性能更好（也是 sass 官方使用的），而且 node-sass 因为国情问题经常装不上
