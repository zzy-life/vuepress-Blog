<template>
  <div class="docs">
    <lottie
      :options="defaultOptions.animation"
      :height="400"
      :width="400"
      v-on:animCreated="handleAnimation"
    />
  </div>
</template>

<script>
import Lottie from "../components/lottie.vue";
import * as fan404 from "../../public/css-js/119776-table-fan-404-error.json";
import * as page404 from "../../public/css-js/115858-404-page-not-found.json";
import * as ufo404 from "../../public/css-js/119608-404-ufo-error-page.json";
export default {
  components: {
    lottie: Lottie,
  },
  data() {
    return {
      animation: [fan404, page404, ufo404],
      defaultOptions: {
        animation:{
            animationData: null,
        }
        
      },
    };
  },
  methods: {
    handleAnimation(anim) {
      this.anim = anim;
    },
  },
  created() {
    this.defaultOptions.animation.animationData = this.animation[
      Math.floor(Math.random() * this.animation.length)
    ].default;
  }
};
</script>


