---
home: true
heroImage: /img/logo.png
actionText: 开始
heroText: zzy-Blog
meta:
  - name: description
    content: 张志宇(zhangzhiyu)的个人网站
  - name: keywords
    content: 时不待我,张志宇,zhangzhiyu,webrarcx.com
tagline: null
actionLink: /guide/
lang: zh-CN
comment: true
kinesis: true
---

::: slot footer
MIT Licensed | Copyright © [网弧](https://www.webarcx.com) 2021-present You  
:::


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
  },
  methods: {
    handleAnimation(anim, type) {
      this.anim[type] = anim;
    },
   
  },
  mounted(){
    
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

</style>
