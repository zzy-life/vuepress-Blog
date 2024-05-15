# uniapp怎么上传附件

>  在UniApp开发中，处理附件上传可能会遇到挑战。幸运的是，有许多插件可以帮助简化这个过程。本文将介绍如何利用这些插件解决UniApp中的附件上传问题。我们将深入探讨如何选择、安装和配置适用于UniApp的附件上传插件，并提供详细的步骤和示例代码，以确保您能够顺利地实现附件上传功能。无论您是初学者还是有经验的开发者，本文都将为您提供宝贵的指导，帮助您克服UniApp附件上传的挑战。 



## 下载插件

https://ext.dcloud.net.cn/plugin?id=5459



## 代码案例

vue:

```html
                            <lsj-upload
                                ref="lsjUpload1"
                                childId="upload1"
                                :width="width"
                                :height="height"
                                :option="option"
                                :size="size"
                                :multiple="false"
                                :count="count"
                                :formats="formats"
                                :debug="debug"
                                :instantly="instantly"
                                @change="onChange"
                                @uploadEnd="onuploadEnd"
                                @onClick="on_fileTap"
                            >
                                <view class="form-upload" :style="{ width: width, height: height }" @tap="uploadCallback">
                                    <image class="upload-icon" :src="imageurl + '/Public/WAP/images/member/upload.png'" mode="aspectFit" />
                                    <view class="upload-text">选择附件</view>
                                </view>
                                <image class="form-more" :src="imageurl + '/Public/WAP/images/userinfo/des.png'" mode="aspectFit" />
                            </lsj-upload>

```



uploadCallback方法是调用权限弹窗组件，同意回调后才创建上传组件

js:

```vue
<script>
import { baseImageUrl, baseUrl } from "../../utils/config/baseurl";
import cache from "../../utils/config/cache";
import http from "../../utils/config/http";
export default {
    components: {},
    data() {
        return {
            imageurl: baseImageUrl,
            loading: false,
            data: {
                name: "",
            },
            // 上传接口参数
            option: {
                // 上传服务器地址，需要替换为你的接口地址
                url: `${baseUrl}Wxapi/Member/uploadAppendixes`, // 该地址非真实路径，需替换为你项目自己的接口地址
                // 上传附件的key
                name: "fileName",
                // 根据你接口需求自定义请求头,默认不要写content-type,让浏览器自适配
                header: {
                    token: cache.get("token"),
                },
                // 根据你接口需求自定义body参数
                formData: {
                    // 'orderId': 1000
                },
            }, // 选择文件后是否立即自动上传，true=选择后立即上传
            instantly: true,
            // 必传宽高且宽高应与slot宽高保持一致
            width: "100%",
            height: "180rpx",
            // 限制允许上传的格式，空串=不限制，默认为空
            formats: "",
            // 文件上传大小限制
            size: 30,
            // 文件数量限制
            count: 100,
            // 文件回显列表
            files: new Map(),
            // 是否打印日志
            debug: false,

            // 演示用
            tabIndex: 0,
        };
    },
    methods: {
        uploadCallback() {
            // #ifdef APP
            uni.navigateTo({
                url: `/pages/yk_authpup/yk_authpup?permissionID=WRITE_EXTERNAL_STORAGE`,
                events: {
                    refreshPage: () => {
                        //调用权限申请，已授权
                        this.changeAuth();
                    },
                },
            });
            // #endif

            // #ifndef APP
            this.changeAuth();
            // #endif
        },
        changeAuth() {
            this.$refs["lsjUpload0"] && this.$refs["lsjUpload0"].create();
        },
       

        // 上传附件
        choose_file(callback) {
            // #ifdef MP-WEIXIN
            uni.chooseMessageFile({
                count: 1,
                type: "all",
                extension: [".pdf", ".jpg", ".jpeg", ".png", ".doc", ".docx"],
                success(res) {
                    if (res.errMsg === "chooseMessageFile:ok" && res.tempFiles && res.tempFiles.length) {
                        const file = res.tempFiles[0];
                        callback(file.path);
                    }
                },
            });
            // #endif
        },

        handle_upload({ filepath }) {
            const that = this;
            uni.showLoading({
                title: "上传中...",
            });
            const uploadTask = uni.uploadFile({
                filePath: filepath,
                name: "fileName",
                header: {
                    token: cache.get("token"),
                },
                url: `${baseUrl}Wxapi/Member/uploadAppendixes`,
                success(r) {
                   
                },
               
            });
            if (uploadTask) {
                uploadTask.onProgressUpdate((res) => {
                    uni.showLoading({
                        title: `上传进度${res.progress}`,
                    });
                });
            }
        },

        

        on_upload() {
            const that = this;
            that.choose_file((filepath) => {
                that.handle_upload({
                    filepath,
                });
            });
        },
        on_fileTap() {
            console.log("ssss");
        },

        on_preview() {
            const that = this;
            const downloadURL = `${baseImageUrl}${that.data.file}`;
            if (downloadURL) {
                uni.showLoading({
                    title: "下载中...",
                });
                uni.downloadFile({
                    url: downloadURL,
                    success(res) {
                        uni.hideLoading();
                        const filePath = res.tempFilePath;
                        uni.openDocument({
                            filePath: filePath,
                            showMenu: true,
                            success(res) {
                                // console.info('打开文档成功')
                            },
                        });
                    },
                    complete() {
                        uni.hideLoading();
                    },
                });
            }
        },

        /**
         * 某文件上传结束回调(成功失败都回调)
         * @param {Object} item 当前上传完成的文件
         */
        onuploadEnd(item) {
            console.log(`${item.name}已上传结束，上传状态=${item.type}`);
            const responseText = JSON.parse(item.responseText);
            if (responseText.status != 0) {
                this.fetchResumeInfo(true);
            } else {
                uni.showToast({
                    icon: "none",
                    title: responseText.msg || "系统异常",
                });
            }
            uni.hideLoading();
            // 更新当前窗口状态变化的文件
            this.files.set(item.name, item);

            // 强制更新视图
            this.$forceUpdate();

            // ---可删除--演示判断是否所有文件均已上传成功
            let isAll = [...this.files.values()].find((item) => item.type !== "success");
            if (!isAll) {
                console.log("已全部上传完毕");
            } else {
                console.log(isAll.name + "待上传");
            }
        },
        // 文件选择回调
        onChange(files) {
            uni.showLoading({
                title: "上传中...",
            });
            console.log("当前选择的文件列表：", JSON.stringify([...files.values()]));
            // 更新选择的文件
            this.files = files;
            // 强制更新视图
            this.$forceUpdate();
        },
    },
};
</script>
```

