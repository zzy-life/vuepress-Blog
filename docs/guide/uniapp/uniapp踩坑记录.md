# uniapp踩坑记录

>  UniApp是一个强大的跨平台开发框架，但在开发过程中，开发者常常会遇到一些棘手的问题。本文旨在记录并解决UniApp开发中的常见问题，包括点击事件失效、页面代码不渲染和iOS时间格式异常等。  



## 怎么主动关闭软键盘

```javascript
uni.hideKeyboard()
```



## nvue中fixed无法覆盖scroll-view

 通过`cover-view`实现内容覆盖 

