# vuepress常见问题

> vuepress常见问题

## 部署之后中文路径刷新跳转到首页

> 由于打包之后页面文件名乱码，导致找不到页面

检查服务器dist文件夹查看中文文件名是否乱码

如有乱码，请直接上传文件夹，不要使用ZIP解压

> 如无法解决，请尝试一下方法

1. 在.vuepress新建enhanceApp.js

2. 加入以下代码

   ```javascript
   import Router from 'vue-router'
   export default ({
       router
   }) => {
     function decode (str) {
       try {
         console.log(decodeURIComponent(str));
         console.log(process.env.NODE_ENV);
         return decodeURIComponent(str)
       } catch (err) {
         if (process.env.NODE_ENV !== 'production') {
           warn(false, ("Error decoding \"" + str + "\". Leaving it intact."));
         }
       }
       return str
     }
     
     const VueRouterMatch = Router.prototype.match
     Router.prototype.match = function match (raw, currentRoute, redirectedFrom) {
       if (typeof raw === 'string') {
         raw = decode(raw)
       }
       return VueRouterMatch.call(this, raw, currentRoute, redirectedFrom)
     }
   
   
      
   }
   ```

## 无法从URL地址直接跳转锚点

1. 修改node_modules\@vuepress\theme-default\layouts\Layout.vue
2. 加入以下代码

```javascript
 mounted() {
    this.$router.afterEach(() => {
      this.isSidebarOpen = false;
    });
    const hash = document.location.hash;
    if (hash.length > 1) {
      setTimeout(() => {
        const id = decodeURIComponent(hash.substring(1));
        const element = document.getElementById(id);
        if (element) element.scrollIntoView();
      }, 1000);
    }
  },
```

## 如何在md文件中使用element-ui

1. 进入vuepress根目录，执行命令

   ```text
   npm install element-ui
   ```

2. 接下来需要修改用于客户端应用增强的`docs/.vuepress/enhanceApp.js`文件

   ```javascript
   import Element from 'element-ui';
   import 'element-ui/lib/theme-chalk/index.css';
   
   export default ({ Vue, options, router }) => {
     Vue.use(Element);
   };
   ```

> 如出现报错Cannot find module ‘core-js/library/fn/object/assign
>
> 安装依赖

```text
npm install async-validator@1.11.5
```

## 滑动内容左侧导航栏未进行跟随

修改源码node_modules\@vuepress\plugin-active-header-links\clientRootMixin.js

```javascript
/* global AHL_SIDEBAR_LINK_SELECTOR, AHL_HEADER_ANCHOR_SELECTOR */

import debounce from 'lodash.debounce'

export default {
  mounted () {
    this.activationLink()
    this.isInViewPortOfOne()
    window.addEventListener('scroll', this.onScroll)
  },
  updated: function () {
    this.isInViewPortOfOne()
  },

  methods: {
    activationLink() {
      const subtitles = [].slice.call(document.querySelectorAll(AHL_SIDEBAR_LINK_SELECTOR))
        .filter(subtitle => decodeURIComponent(this.$route.hash) == decodeURIComponent(subtitle.hash))
      if (subtitles == null || subtitles.length < 1 || subtitles[0].offsetTop == undefined|| location.hash == "") return
      subtitles[0].click()
    },

    isInViewPortOfOne() {
      let siderbarScroll = document.getElementsByClassName("sidebar")[0]
      let el = document.getElementsByClassName("active sidebar-link")[1]
      if (el == null || el == undefined || el.offsetTop == undefined) {
        el = document.getElementsByClassName("active sidebar-link")[0]
      }
      if (el == null || el == undefined || el.offsetTop == undefined) return

      const viewPortHeight = siderbarScroll.clientHeight || window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
      let offsetTop = el.offsetTop
      let offsetBottom = el.offsetTop + el.offsetHeight
      let scrollTop = siderbarScroll.scrollTop
      let bottomVisible = (offsetBottom <= viewPortHeight + scrollTop)
      if (!bottomVisible) {
        siderbarScroll.scrollTop = (offsetBottom + 5 - viewPortHeight)
      }
      let topVisible = (offsetTop >= scrollTop)
      if (!topVisible) {
        siderbarScroll.scrollTop = (offsetTop - 5)
      }
    },
    onScroll: debounce(function () {
      this.setActiveHash()
    }, 300),

    setActiveHash () {
      const sidebarLinks = [].slice.call(document.querySelectorAll(AHL_SIDEBAR_LINK_SELECTOR))
      const anchors = [].slice.call(document.querySelectorAll(AHL_HEADER_ANCHOR_SELECTOR))
        .filter(anchor => sidebarLinks.some(sidebarLink => sidebarLink.hash === anchor.hash))

      const scrollTop = Math.max(
        window.pageYOffset,
        document.documentElement.scrollTop,
        document.body.scrollTop
      )

      const scrollHeight = Math.max(
        document.documentElement.scrollHeight,
        document.body.scrollHeight
      )

      const bottomY = window.innerHeight + scrollTop

      for (let i = 0; i < anchors.length; i++) {
        const anchor = anchors[i]
        const nextAnchor = anchors[i + 1]

        const isActive = i === 0 && scrollTop === 0
          || (scrollTop >= anchor.parentElement.offsetTop + 10
            && (!nextAnchor || scrollTop < nextAnchor.parentElement.offsetTop - 10))

        const routeHash = decodeURIComponent(this.$route.hash)
        if (isActive && routeHash !== decodeURIComponent(anchor.hash)) {
          const activeAnchor = anchor
          // check if anchor is at the bottom of the page to keep $route.hash consistent
          if (bottomY === scrollHeight) {
            for (let j = i + 1; j < anchors.length; j++) {
              if (routeHash === decodeURIComponent(anchors[j].hash)) {
                return
              }
            }
          }
          this.$vuepress.$set('disableScrollBehavior', true)
          this.$router.replace(decodeURIComponent(activeAnchor.hash), () => {
            // execute after scrollBehavior handler.
            this.$nextTick(() => {
              this.$vuepress.$set('disableScrollBehavior', false)
            })
          })
          return
        }
      }
    }
  },

  beforeDestroy () {
    window.removeEventListener('scroll', this.onScroll)
  }
}

```

[可参考](https://github.com/vuejs/vuepress/pull/2272)

## 优化之last updated 最后更新时间如何设置

[参见](https://zhuanlan.zhihu.com/p/454513921)



## 源码修改指引

1. [无法从URL地址直接跳转锚点](/guide/vuepress/常见问题.md#无法从url地址直接跳转锚点)
2. [滑动内容左侧导航栏未进行跟随](/guide/vuepress/常见问题.md#滑动内容左侧导航栏未进行跟随)
3. [全文搜索插件移动端适配](/guide/vuepress/集成全文搜索插件.md#移动端适配问题)
4. [音乐插件无用图片请求不到](/guide/vuepress/音乐插件.md#注意)
5. [音乐插件使用本地音源没有自动注入base问题](/guide/vuepress/音乐插件.md#使用本地音源没有自动注入base问题)



