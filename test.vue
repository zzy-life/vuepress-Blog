

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
    <div class="header">
      <header class="hero">
        <img src="/vuepress/img/logo.png" alt="hero" />
        <h1 id="main-title">zzy-Blog</h1>
        <!---->
        <el-button type="success" class="action-button"
          ><a href="/vuepress/guide/"> 开始 </a></el-button
        >
      </header>
    </div>
    <kinesis-container>
      Here, you can put
      <kinesis-element :strength="10"> whatever </kinesis-element>
      <kinesis-element :strength="20"> content! </kinesis-element>
    </kinesis-container>
    <div class="docs">
      <lottie
        class="lottie"
        :options="defaultOptions.confettiData"
        :height="300"
        v-on:animCreated="handleAnimation($event, 'confettiData')"
      />
      <div class="px-4 py-12 md:px-6 lg:px-4" style="margin-top: 30px">
        <div
          class="text-1000 font-bold text-5xl mb-4 text-center"
          style="letter-spacing: 7px"
        >
          推荐文章
        </div>
        <lottie
          class="starslottie"
          :options="defaultOptions.starsData"
          v-on:animCreated="handleAnimation($event, 'starsData')"
        />
        <div class="grid">
          <router-link
            class="col-12 lg:col-4 cursor-pointer"
            to="./guide/python/人脸识别"
          >
            <div class="p-3 h-full">
              <Card class="card">
                <template #header>
                  <img
                    alt="user header"
                    class="overflow-hidden title_img"
                    style="height: 200px"
                    src="./guide/python/image/45e049b6-025d-11e7-89cc-8a71cf89e713.png"
                  />
                </template>
                <template #title>
                  <div class="info_title">人脸识别服务</div>
                </template>
                <template #content>
                  <div class="info_text">
                    基于Face
                    Recognition，Mysql，PostgreSQL数据库的私有化人脸检索服务，可用于登陆，人脸考勤等.
                  </div>
                </template>
                <template #footer> </template>
              </Card>
            </div>
          </router-link>
          <router-link
            class="col-12 lg:col-4 cursor-pointer"
            to="./guide/springboot/软著源代码材料生成器"
          >
            <div class="p-3 h-full">
              <Card class="hover:shadow-7 card">
                <template #header>
                  <img
                    alt="user header"
                    class="overflow-hidden title_img"
                    style="height: 200px"
                    src="./guide/springboot/image/7f17530e0db64335b8cad83d7210d9b1.png"
                  />
                </template>
                <template #title>
                  <div class="info_title">软著源代码材料生成器</div>
                </template>
                <template #content>
                  <div class="info_text">
                    可一键生成软件著作权所需源代码材料。
                  </div>
                </template>
                <template #footer> </template>
              </Card>
            </div>
          </router-link>
          <router-link
            class="col-12 lg:col-4 cursor-pointer"
            to="./figure/EvanYou/尤雨溪谈Vue.js ：缔造自由与真我"
          >
            <div class="p-3 h-full">
              <Card class="hover:shadow-6 card">
                <template #header>
                  <img
                    alt="user header"
                    class="overflow-hidden title_img"
                    style="height: 200px"
                    src="./figure/EvanYou/image/110112_54273780_1887527.jpeg"
                  />
                </template>
                <template #title>
                  <div class="info_title">尤雨溪谈Vue.js</div>
                </template>
                <template #content>
                  <div class="info_text">
                    前端框架Vue.js
                    作者，独立开源开发者，现居美国新泽西，现在全职开发和维护
                    Vue.js，vite，vitepress，vuepress。
                  </div>
                </template>
                <template #footer> </template>
              </Card>
            </div>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { KinesisContainer, KinesisElement} from 'vue-kinesis';
import Lottie from "./.vuepress/theme/components/lottie.vue";
import * as confettiData from "./.vuepress/public/css-js/116943-confetti-3colorsjson.json";
import * as starsData from "./.vuepress/public/css-js/114031-rating-stars.json";
export default {
  data() {
    return {
      anim: {
        confettiData: null,
        starsData: null,
      },
      defaultOptions: {
        confettiData: {
          animationData: confettiData.default,
        },

        starsData: {
          animationData: starsData.default,
        },
      },
    };
  },
  components: {
    lottie: Lottie,
    KinesisContainer:KinesisContainer,
    KinesisElement:KinesisElement
  },
  created() {
    this.$notify({
      title: "微信公众号",
      dangerouslyUseHTMLString: true,
      message: "<strong><i>时不待我</i> </strong>",
      duration: 9000,
      offset: 40,
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
        this.anim["starsData"].setSpeed(0.5);
        // DOM 更新了
      });
  }
};
</script>
<style scoped>
.header .hero {
  text-align: center;
}
.header .hero h1 {
  font-size: 3rem;
  margin: 1.8rem auto;
}
.header .hero img {
  max-width: 100%;
  max-height: 280px;
  display: block;
  margin: 3rem auto 1.5rem;
}
.header .hero .action-button {
  line-height: 1.7;
  font-size: 1.2rem;
  padding: 0.8rem 1.6rem;
  background-color: #3eaf7c;
  border-bottom: 1px solid #389d70;
  color: #fff;
  border-radius: 4px;
  transition: background-color 0.1s ease;
  box-sizing: border-box;
}
.header .hero .action-button:hover,
.header .hero .action-button:focus {
  background-color: #4abf8a;
}
.header .hero .action-button a {
  color: #fff;
  text-decoration: none;
}
.docs {
  margin-top: 140px;
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
