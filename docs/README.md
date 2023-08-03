---
home: true
heroImage: /img/logo.png
actionText: 开始
heroText: zzy-Blog
tagline: null
actionLink: /guide/

lang: zh-CN
comment: true
kinesis: true

---

::: slot footer
MIT Licensed | Copyright © [网弧](https://www.webarcx.com) 2021-present You  
:::



<!-- kinesis首页动画 -->

<!-- <template>
<div class="docs">
  <el-dialog
  title="支付宝红包又来啦"
  :visible.sync="dialogVisible"
center>
  <div class="demo-image">
  <div class="block">
    <span class="demonstration"></span>
    <el-image
      style="width: 100%; height: 100%"
      src="./img/zhifubao.jpg"
      fit="cover"></el-image>
  </div>
</div>
</el-dialog>
</div>
</template>

<script>
export default {
 data() {
      return {
        dialogVisible: true
      };
    },
}
</script>

<style>
.docs  .el-dialog__wrapper .el-dialog--center{
  max-width:300px;
}
</style> -->

<template>
  <div>
    <div class="docs">
    <div class="heti heti--poetry">
      <h2>定风波<span class="heti-meta heti-small">[宋]<abbr title="号东坡居士">苏轼</abbr></span></h2>
        <p class="heti-x-large">
        三月七日，沙湖道中遇雨<span class="heti-hang">。</span><br>雨具先去，同行皆狼狈，余独不觉，已而遂晴，故作此词<span class="heti-hang">。</span><br>
        莫听穿林打叶声，何妨吟啸且徐行<span class="heti-hang">。</span><br>竹杖芒鞋轻胜马，谁怕？一蓑烟雨任平生<span class="heti-hang">。</span><br>
        料峭春风吹酒醒，微冷，山头斜照却相迎<span class="heti-hang">。</span><br>回首向来萧瑟处，归去，也无风雨也无晴<span class="heti-hang">。</span><br>
        </p>
    </div>
      <lottie
        class="lottie"
        :options="defaultOptions.confettiData"
        :height="300"
        v-on:animCreated="handleAnimation($event, 'confettiData')"
      />
    </div>
  </div>
</template>

<script>
import Lottie from "./.vuepress/theme/components/lottie.vue";
import * as confettiData from "./.vuepress/public/css-js/116943-confetti-3colorsjson.json";
export default {
  data() {
    return {
      anim: {
        confettiData: null,
      },
      defaultOptions: {
        confettiData: {
          animationData: confettiData.default,
        },

       
      },
    };
  },
  components: {
    lottie: Lottie,
  },
  created() {
    this.$notify({
      title: "微信公众号",
      dangerouslyUseHTMLString: true,
      message: "<strong>  <img  src='/img/logo.jpg'/> </strong>",
      duration: 10000,
      offset: 50,
    });
   
  },
  methods: {
    handleAnimation(anim, type) {
      this.anim[type] = anim;
    },
  },
  mounted(){
    this.$nextTick(() => {
    //设置动画速度
        this.anim["confettiData"].setSpeed(2);
        // DOM 更新了
      });
  }
};
</script>
<style scoped>
.docs {
  margin-top: 60px;
}
.docs .lottie {
  position: absolute;
  top: 20px;
  left: 50%;
  transform: translate(-50%, 0%);
}
.docs .starslottie {
  width: 100% !important;
  height: 200px !important;
  overflow: hidden !important;
  margin: -80px auto -70px auto !important;
}
.card {
  height: 100%;
  border-radius: 6px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.03), 0 0 2px rgba(0, 0, 0, 0.06),
    0 2px 6px rgba(0, 0, 0, 0.12);
  transition: all 0.3s ease;
}
.card:hover {
  transform: scale(1.1, 1.1);
}
.info_title {
  font-weight: 500;
  color: #212121;
  font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica,
    Arial, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol;
}
.info_text {
  color: #616161;
}
.title_img {
  border-top-left-radius: 6px;
  border-top-right-radius: 6px;
}
</style>
