---
title: 动画
---
::: v-pre
# vue动画

> Vue 在插入、更新或者移除 DOM 时，提供多种不同方式的应用过渡效果。
> 
> Vue 提供了内置的过渡封装组件，该组件用于包裹要实现过渡效果的组件。



## 基本使用

Vue 提供了 `transition` 的封装组件，在下列情形中，可以给任何元素和组件添加进入/离开过渡

- 条件渲染 (使用 `v-if`)
- 条件展示 (使用 `v-show`)



```html
<div id="demo">
  <button v-on:click="show = !show">
    Toggle
  </button>
  <transition>
    <p v-show="show">hello</p>
  </transition>
</div>
```



```js
new Vue({
  el: '#demo',
  data: {
    show: true
  }
})
```

样式处理

```css
.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s;
}
.v-enter,
.v-leave-to {
  opacity: 0;
}
.v-leave,
.v-enter-to {
  opacity: 1;
}
```

## 指定name

> 如果有多个动画，可以指定name属性

```html
  <transition>
    <p v-show="show">hello</p>
  </transition>
```

+ 样式

```css
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
.fade-leave,
.fade-enter-to {
  opacity: 1;
}
```



## 结合动画使用

结构

```html
<div id="app">
  <button @click="show = !show">切换</button>
  <transition name="fade">
    <h1 v-show="show">{{ msg }}</h1>
  </transition>
</div>
```

样式

```css
.fade-enter-active {
  animation: bounce-in 0.5s;
}
.fade-leave-active {
  animation: bounce-in 0.5s reverse;
}
@keyframes bounce-in {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.5);
  }
  100% {
    transform: scale(1);
  }
}
```



## 自定义过渡的类名

我们可以通过以下特性来自定义过渡类名：

- `enter-class`
- `enter-active-class`
- `enter-to-class`
- `leave-class`
- `leave-active-class`
- `leave-to-class` 

```html
<transition name="fade" enter-active-class="in" leave-active-class="out">
  <h1 v-show="show">{{ msg }}</h1>
</transition>
```



```css
.in {
  animation: bounce-in 0.5s;
}
.out {
  animation: bounce-in 0.5s reverse;
}
@keyframes bounce-in {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.5);
  }
  100% {
    transform: scale(1);
  }
}
```

## 配合animate.css使用

```html
<link href="https://cdn.jsdelivr.net/npm/animate.css@3.5.1" rel="stylesheet" type="text/css">

<div id="example-3">
  <button @click="show = !show">
    Toggle render
  </button>
  <transition
    name="custom-classes-transition"
    enter-active-class="animated tada"
    leave-active-class="animated bounceOutRight"
  >
    <p v-if="show">hello</p>
  </transition>
</div>
```
:::




