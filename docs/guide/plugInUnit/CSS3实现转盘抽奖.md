# CSS3 实现转盘抽奖

> CSS3 实现转盘抽奖

最近有个转盘抽奖的需求，搜了一下现有的轮子，有的是用 jQuery 的动画函数实现的，有的是用 canvas 绘图然后再用高频率的 setTimeout 调用旋转方法，前者太老了没法简单移植到 vue 项目，后者感觉性能表现可能不会太好。也有一些用 CSS 动画的方案，设计了加速-匀速-减速三个动画，再计算偏转角度让三个动画尽可能无缝衔接，但我感觉绕了大远路，应该有更简单轻量的实现方案。个人更倾向于用 transition 来实现，不过网上的例子感觉还不够好，有的倾斜文字都没有对齐，最后还是自己手写了一个。核心思路是用 transition 以及 rotate 实现旋转动画，使用 transition-origin 和 rotate 绘制出定位较为精确的轮盘奖项，同时支持动态设置奖品数量。

## 样例

<template>
  <div class="docs">
    <span>Prize number: {{ prizeNumber }}</span>
    <button
      type="button"
      @click="!rolling && prizeNumber < 8 && prizeNumber++"
      :disabled="rolling || prizeNumber === 8"
    >
      Add
    </button>
    <button
      type="button"
      @click="!rolling && prizeNumber > 2 && prizeNumber--"
      :disabled="rolling || prizeNumber === 2"
    >
      Remove
    </button>
    <div class="wheel-wrapper">
      <div class="wheel-pointer" @click="onClickRotate">Start</div>
      <div
        class="wheel-bg"
        :class="{ freeze: freeze }"
        :style="`transform: rotate(${wheelDeg}deg)`"
      >
        <div class="prize-list">
          <div
            class="prize-item-wrapper"
            v-for="(item, index) in prizeList"
            :key="index"
          >
            <div
              class="prize-item"
              :style="`transform: rotate(${
                (360 / prizeList.length) * index
              }deg)`"
            >
              <div class="prize-name">
                {{ item.name }}
              </div>
              <div class="prize-icon">
                <img :src="item.icon" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      freeze: false,
      rolling: false,
      wheelDeg: 0,
      prizeNumber: 8,
      prizeListOrigin: [
        {
          icon: "https://picsum.photos/40?random=1",
          name: "$10000",
        },
        {
          icon: "https://picsum.photos/40?random=6",
          name: "Thank you!",
        },
        {
          icon: "https://picsum.photos/40?random=2",
          name: "$500",
        },
        {
          icon: "https://picsum.photos/40?random=3",
          name: "$100",
        },
        {
          icon: "https://picsum.photos/40?random=6",
          name: "Thank you!",
        },
        {
          icon: "https://picsum.photos/40?random=4",
          name: "$50",
        },
        {
          icon: "https://picsum.photos/40?random=5",
          name: "$10",
        },
        {
          icon: "https://picsum.photos/40?random=6",
          name: "Thank you!",
        },
      ],
    };
  },
  computed: {

    prizeList() {
      return this.prizeListOrigin.slice(0, this.prizeNumber);
    },
  },
   mounted () {
      this.$page.lastUpdated = "2022/1/14 下午6:09:09";
  },
  methods: {
    onClickRotate() {
      if (this.rolling) {
        return;
      }
      const result = Math.floor(Math.random() * this.prizeList.length);
      this.roll(result);
    },
    roll(result) {
      this.rolling = true;
      const { wheelDeg, prizeList } = this;
      this.wheelDeg =
        wheelDeg -
        (wheelDeg % 360) +
        6 * 360 +
        (360 - (360 / prizeList.length) * result);
      setTimeout(() => {
        this.rolling = false;
        alert("Result：" + prizeList[result].name);
      }, 4500);
    },
  },
  watch: {
    prizeNumber() {
      this.freeze = true;
      this.wheelDeg = 0;

      setTimeout(() => {
        this.freeze = false;
      }, 0);
    },
  },
};
</script>

<style lang="scss">
.docs html {
  background: #dd7c7d;
}

.docs .wheel-wrapper {
  width: 300px;
  height: 300px;
  position: relative;
  left: 50%;
  transform: translate(-50%, 0%);
}

.docs .wheel-pointer {
  width: 60px;
  height: 60px;
  border-radius: 1000px;
  background: yellow;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  line-height: 60px;
  z-index: 10;
  cursor: pointer;

  &::after {
    content: "";
    position: absolute;
    top: -32px;
    left: 50%;
    border-width: 0 8px 40px;
    border-style: solid;
    border-color: transparent transparent yellow;
    transform: translateX(-50%);
  }
}
.docs .wheel-bg {
  width: 100%;
  height: 100%;
  border-radius: 1000px;
  overflow: hidden;
  transition: transform 4s ease-in-out;
  background: #7eef97;

  &.freeze {
    transition: none;
    background: red;
  }
}

.docs .prize-list {
  width: 100%;
  height: 100%;
  position: relative;
  text-align: center;
}

.docs .prize-item-wrapper {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 150px;
  height: 150px;
}

.docs .prize-item {
  width: 100%;
  height: 100%;
  transform-origin: bottom;

  .prize-name {
    padding: 16px 0;
  }

  .prize-icon {
  }
}
</style>

## 源码

```vue
<template>
  <div class="docs">
    <span>Prize number: {{ prizeNumber }}</span>
    <button
      type="button"
      @click="!rolling && prizeNumber < 8 && prizeNumber++"
      :disabled="rolling || prizeNumber === 8"
    >
      Add
    </button>
    <button
      type="button"
      @click="!rolling && prizeNumber > 2 && prizeNumber--"
      :disabled="rolling || prizeNumber === 2"
    >
      Remove
    </button>
    <div class="wheel-wrapper">
      <div class="wheel-pointer" @click="onClickRotate">Start</div>
      <div
        class="wheel-bg"
        :class="{ freeze: freeze }"
        :style="`transform: rotate(${wheelDeg}deg)`"
      >
        <div class="prize-list">
          <div
            class="prize-item-wrapper"
            v-for="(item, index) in prizeList"
            :key="index"
          >
            <div
              class="prize-item"
              :style="`transform: rotate(${
                (360 / prizeList.length) * index
              }deg)`"
            >
              <div class="prize-name">
                {{ item.name }}
              </div>
              <div class="prize-icon">
                <img :src="item.icon" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      freeze: false,
      rolling: false,
      wheelDeg: 0,
      prizeNumber: 8,
      prizeListOrigin: [
        {
          icon: "https://picsum.photos/40?random=1",
          name: "$10000",
        },
        {
          icon: "https://picsum.photos/40?random=6",
          name: "Thank you!",
        },
        {
          icon: "https://picsum.photos/40?random=2",
          name: "$500",
        },
        {
          icon: "https://picsum.photos/40?random=3",
          name: "$100",
        },
        {
          icon: "https://picsum.photos/40?random=6",
          name: "Thank you!",
        },
        {
          icon: "https://picsum.photos/40?random=4",
          name: "$50",
        },
        {
          icon: "https://picsum.photos/40?random=5",
          name: "$10",
        },
        {
          icon: "https://picsum.photos/40?random=6",
          name: "Thank you!",
        },
      ],
    };
  },

  computed: {
    prizeList() {
      return this.prizeListOrigin.slice(0, this.prizeNumber);
    },
  },
  methods: {
    onClickRotate() {
      if (this.rolling) {
        return;
      }
      const result = Math.floor(Math.random() * this.prizeList.length);
      this.roll(result);
    },
    roll(result) {
      this.rolling = true;
      const { wheelDeg, prizeList } = this;
      this.wheelDeg =
        wheelDeg -
        (wheelDeg % 360) +
        6 * 360 +
        (360 - (360 / prizeList.length) * result);
      setTimeout(() => {
        this.rolling = false;
        alert("Result：" + prizeList[result].name);
      }, 4500);
    },
  },
  watch: {
    prizeNumber() {
      this.freeze = true;
      this.wheelDeg = 0;

      setTimeout(() => {
        this.freeze = false;
      }, 0);
    },
  },
};
</script>

<style lang="scss">
.docs html {
  background: #dd7c7d;
}

.docs .wheel-wrapper {
  width: 300px;
  height: 300px;
  position: relative;
  left: 50%;
  transform: translate(-50%, 0%);
}

.docs .wheel-pointer {
  width: 60px;
  height: 60px;
  border-radius: 1000px;
  background: yellow;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  line-height: 60px;
  z-index: 10;
  cursor: pointer;

  &::after {
    content: "";
    position: absolute;
    top: -32px;
    left: 50%;
    border-width: 0 8px 40px;
    border-style: solid;
    border-color: transparent transparent yellow;
    transform: translateX(-50%);
  }
}
.docs .wheel-bg {
  width: 100%;
  height: 100%;
  border-radius: 1000px;
  overflow: hidden;
  transition: transform 4s ease-in-out;
  background: #7eef97;

  &.freeze {
    transition: none;
    background: red;
  }
}

.docs .prize-list {
  width: 100%;
  height: 100%;
  position: relative;
  text-align: center;
}

.docs .prize-item-wrapper {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 150px;
  height: 150px;
}

.docs .prize-item {
  width: 100%;
  height: 100%;
  transform-origin: bottom;

  .prize-name {
    padding: 16px 0;
  }

  .prize-icon {
  }
}
</style>
```
