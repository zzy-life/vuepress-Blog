<!--
 * @Author: 时不待我 790002517@qq.com
 * @Date: 2022-09-15 15:00:25
 * @LastEditors: 时不待我 790002517@qq.com
 * @LastEditTime: 2022-09-17 22:58:18
-->
<template>
    <div :style="style" ref="lavContainer"></div>
</template>

<script>
   import lottie from 'lottie-web';
  export default {
    props: {
      options: {
        type: Object,
        required: true
      },
      height: Number,
      width: Number,
    },
    data () {
      return {
        style: {
          width: this.width ? `${this.width}px` : '100%',
          height: this.height ? `${this.height}px` : '100%',
          overflow: 'hidden',
          margin: '0 auto'
        }
      }
    },
    mounted () {
      this.anim = lottie.loadAnimation({
          container: this.$refs.lavContainer,
          renderer: 'canvas',
          progressiveLoad:true,
          loop: this.options.loop !== false,
          autoplay: this.options.autoplay !== false,
          animationData: this.options.animationData,
          rendererSettings: this.options.rendererSettings
        }
      );
      this.$emit('animCreated', this.anim)
    }
  }
</script>