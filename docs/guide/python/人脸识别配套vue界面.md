 
# 配套vue界面

## 下载

```bash
npm install tracking --save
```



## 代码示例

```vue
<template>
  <div class="testTracking">
    <video
      id="video"
      width="418"
      height="270"
      preload
      autoplay
      loop
      muted
    ></video>
    <canvas id="canvas" width="418" height="270"></canvas>
    <div class="buttonDiv">
      <button type="button" @click="submit">登陆认证</button>
      <button type="button" @click="popup.open = true">拍照注册</button>
    </div>
    <el-dialog title="请输入您的信息，请不要移动" :visible.sync="popup.open">
      <el-form ref="form" label-width="80px" :model="popup" :rules="rules">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="popup.username"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="popup.phone"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="mail">
          <el-input v-model="popup.mail"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="popup.open = false">取 消</el-button>
        <el-button type="primary" @click="zhuce('form')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
require("tracking/build/tracking-min.js");
require("tracking/build/data/face-min.js");
require("tracking/build/data/eye-min.js");
require("tracking/build/data/mouth-min.js");
require("tracking/examples/assets/stats.min.js");

export default {
  name: "Home",
  data() {
    return {
      recty: 0,
      rectx: 0,
      trackerTask: undefined,
      popup: {
        open: false,
        username: undefined,
        phone: undefined,
        mail: undefined,
      },
      rules: {
        username: [
          {
            required: true, //是否必填
            message: "用户名不能为空", //规则
            trigger: "blur", //何事件触发
          },
        ],
        phone: [
          {
            required: true, //是否必填
            message: "手机号不能为空", //规则
            trigger: "blur", //何事件触发
          },
        ],
        mail: [
          {
            required: true, //是否必填
            message: "邮箱不能为空", //规则
            trigger: "blur", //何事件触发
          },
        ],
      },
    };
  },
  mounted() {
    this.openCamera();
  },
  methods: {
    openCamera() {
      var video = document.getElementById("video");

      navigator.mediaDevices
        .getUserMedia({ video: { facingMode: "user" } })
        .then(function (stream) {
          document.getElementById("video").srcObject = stream;
        })
        .catch(function (error) {
          alert(error);
        });
      var canvas = document.getElementById("canvas");
      var context = canvas.getContext("2d");

      var tracker = new tracking.ObjectTracker("face");
      tracker.setInitialScale(4);
      tracker.setStepSize(2);
      tracker.setEdgesDensity(0.1);

      this.trackerTask = tracking.track("#video", tracker, { camera: true });

      tracker.on("track", (event) => {
        context.clearRect(0, 0, canvas.width, canvas.height);
        event.data.forEach((rect) => {
          context.font = "11px Helvetica";
          context.fillText(
            "已识别到人脸，请点击拍照",
            rect.x - 30,
            rect.y - 40
          );
          context.strokeStyle = "#a64ceb";
          context.strokeRect(
            rect.x - 20,
            rect.y - 20,
            rect.width + 20,
            rect.height + 20
          );

          this.rectx = rect.x - 110;
          this.recty = rect.y - 10;
        });
      });
    },
    zhuce(formName) {
      var formData = new FormData();
      let canvas = document.getElementById("canvas");
      let context = canvas.getContext("2d");
      let video = document.getElementById("video");

      context.drawImage(video, -this.rectx, -this.recty, 500, 400);
      let imgUrl = this.saveAsPNG(canvas);
      this.$refs[formName].validate((valid) => {
        if (valid) {
          console.log(imgUrl);
          formData.append("file", imgUrl);
          formData.append("mail", this.popup.mail);
          formData.append("username", this.popup.username);
          formData.append("phone", this.popup.phone);
          this.axios({
            method: "post",
            url: "https://face-890657-1305567820.ap-shanghai.run.tcloudbase.com/face/registration",
            // url: "http://192.168.0.106:5001/face/registration",
            data: formData,
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }).then((response) => {
            console.log(response);
            if (response.data.code == "200") {
              this.$message({
                type: "success",
                message: "注册成功",
              });
            } else {
              this.$message({
                type: "error",
                message: "失败",
              });
            }
          });
        } else {
          return false;
        }
      });
    },
    submit() {
      var formData = new FormData();
      let canvas = document.getElementById("canvas");
      let context = canvas.getContext("2d");
      let video = document.getElementById("video");

      context.drawImage(video, -this.rectx, -this.recty, 500, 400);
      let imgUrl = this.saveAsPNG(canvas);
      console.log(imgUrl);
      formData.append("file", imgUrl);
      this.$prompt("请不要移动", "请输入邮箱", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputPattern:
          /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/,
        inputErrorMessage: "邮箱格式不正确",
      })
        .then(({ value }) => {
          formData.append("mail", value);
          this.axios({
            method: "post",
            url: "https://face-890657-1305567820.ap-shanghai.run.tcloudbase.com/face/verification",
            // url: "http://192.168.0.106:5001/face/verification",
            data: formData,
            headers: {
              "Content-Type": "multipart/form-data",
            },
          })
            .then((response) => {
              console.log(response);
              if (response.data.is_picture_of_obama) {
                this.$message({
                  type: "success",
                  message: "欢迎登陆: " + response.data.username,
                });
              } else {
                this.$message({
                  type: "error",
                  message: "失败",
                });
              }
            })
            .catch(() => {
              this.$message({
                type: "info",
                message: "服务器异常",
              });
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "取消输入",
          });
        });
    },

    // 保存为png,base64格式图片
    saveAsPNG(c) {
      return c.toDataURL("image/jpeg").split(";base64,")[1];
    },
  },
  destroyed() {
    // 停止侦测
    this.trackerTask.stop();
    // 关闭摄像头
    this.trackerTask.closeCamera();
  },
};
</script>
<style lang="less" scoped>
.testTracking {
  height: 100vh;
  width: 100%;
  position: relative;
  > * {
    position: absolute;
    left: 0;
    right: 0;
    margin: auto;
  }
  video,
  canvas {
    top: 0;
  }
  .buttonDiv {
    bottom: 10px;
  }
}
</style>


```

