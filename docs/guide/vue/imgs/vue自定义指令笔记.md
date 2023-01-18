# 自定义指令

> 有的情况下，你仍然需要对**普通 DOM 元素进行底层操作**，这时候就会用到自定义指令。
>
> 比如：获取文本框的焦点 

## 自定义指令

```
- 自定义一个指令
- 使用一个自定义指令
```

定义一个全局的指令

```js
// 注册一个全局自定义指令 `v-focus`
// 参数1：指令的名称
// 参数2：指令的配置项（钩子函数）
Vue.directive('focus', {
  // 当被绑定的元素插入到 DOM 中时……
  // el: 当前绑定的元素
  inserted: function (el) {
    // 聚焦元素
    el.focus()
  }
})
```

使用自定义指令

```html
<input v-focus>
```



## 全局指令与局部指令

定义全局指令

```js
// 注册一个全局自定义指令 `v-focus`
// 参数1：指令的名称
// 参数2：指令的配置项（钩子函数）
Vue.directive('focus', {
  // 当被绑定的元素插入到 DOM 中时……
  // el: 当前绑定的元素
  inserted: function (el) {
    // 聚焦元素
    el.focus()
  }
})
```

定义局部指令

```js
directives: {
  focus: {
    // 指令的定义
    inserted: function (el) {
      el.focus()
    }
  }
}
```

## 指令的钩子函数

+ `bind`:  只会调用一次，当指令绑定到当前元素上时调用
+ `inserted`: 被绑定元素插入父节点时调用
+ `update`: 指令的值发生改变的时候
+ `componentUpdated`: 指令所在的组件中所有的DOM都更新完成的时候
+ `unbind`：只调用一次，指令与元素解绑时调用。

```js
Vue.directive('focus', {
    // 只会调用一次，当指令绑定到当前元素上时调用
    bind (el) {
    },
    // 当前元素被插入到父节点的时候调用(渲染时)
    inserted (el) {
        el.focus()
    },
    // 当指令对应的数据发生改变的时候
    update () {

    },
    // 所有的DOM都更新之后
    componentUpdated () {

    },
    // 指令与元素解绑的时候
    unbind () {

    }

})
```

## 钩子函数的参数

所有的钩子函数两个参数`el`和`binding`

指令的组成

```js
v-指令名:指令参数.指令修饰符.指令修饰符 = "指令的值"
v-on:click.enter.prevent = "clickFn"
```

指令的参数

```js
el: 当前元素
binding：一个对象，包含以下属性：
    name：指令名，不包括 v- 前缀。
    value：指令的绑定值，例如：v-my-directive="1 + 1" 中，绑定值为 2。
    oldValue：指令绑定的前一个值，仅在 update 和 componentUpdated 钩子中可用。无论值是否改变都可用。
    expression：字符串形式的指令表达式。例如 v-my-directive="1 + 1" 中，表达式为 "1 + 1"。
    arg：传给指令的参数，可选。例如 v-my-directive:foo 中，参数为 "foo"。
    modifiers：一个包含修饰符的对象。例如：v-my-directive.foo.bar 中，修饰符对象为 { foo: true, bar: true }。
```



## 实现一个v-text指令

## 实现一个v-bind指令

## 实现一个v-on指令

## 实现了一个v-color



## 指令的简写

在很多时候，你可能想在 `bind` 和 `update` 时触发相同行为，而不关心其它的钩子。比如这样写:

```js
Vue.directive('color-swatch', function (el, binding) {
  el.style.backgroundColor = binding.value
})
```

