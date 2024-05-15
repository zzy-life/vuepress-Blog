# uniapp升级怎么整包更新或者wgt热更新

>  在UniApp开发中，实现应用升级和更新是至关重要的，可以保持应用功能的更新和修复漏洞。本文将介绍如何进行整包更新和热更新，以及如何支持Vue3，并提供组件支持打开安卓和苹果应用市场、实现WGT静默更新、无感知更新以及覆盖原生TabBar和导航栏。   



## 下载插件

https://ext.dcloud.net.cn/plugin?id=7286



## 注意事项

- apk或者wgt包直接上传到云存储就行，但是现在桶必须要绑定自己的域名才能下载apk
- 调试请打包自定义基座测试，否则uni.getSystemInfoSync().platform获取到的可能不是android或者ios，会导致无法跳转更新页
- 进度条显示，下载apk完成后，安卓不会自动弹出安装页面，原因：可能是离线打包未添加安卓安装权限，请添加以下权限或者使用云打包

```xml
<uses-permission android:name="android.permission.INSTALL_PACKAGES" />
<uses-permission android:name="android.permission.REQUEST_INSTALL_PACKAGES" />
```

- 苹果支持appstore链接和wgt更新，不支持整包ipa更新

- wgt更新，进度条100%，苹果无法安装，原因：

  1、wgt包名不要设置为中文，

  2、增加原生模块必须上传appstore，不能热更新

- 不能热更新的有：

  1、如果原项目没有nvue页面，新增nvue后也必须整包更新

  2、增加推送、第三方登录、地图、视频播放、支付等模块，或者其他安卓权限

  3、修改启动图或者app图标


