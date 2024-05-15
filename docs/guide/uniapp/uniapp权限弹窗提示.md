# uniapp权限弹窗提示

>  在UniApp应用开发中，提交到华为、应用宝应用商店，需要在应用中使用权限时提供友好的弹窗提示并解释权限申请目的。本文将介绍如何在UniApp中实现权限弹窗提示与申请流程



## 下载插件

https://ext.dcloud.net.cn/plugin?id=15739



## 代码案例

### 组件:

```vue
<template>
    <view v-if="showPopup" class="uni-popup" :style="{ top: isNativeHead ? '' : StatusBar }">
        <view :class="[type, ani, animation ? 'ani' : '']" class="uni-custom uni-popup__wrapper">
            <view class="uni-popup__wrapper-box">
                <view class="title">{{ authList[permissionID].title }}</view>
                <view class="content">{{ authList[permissionID].content }}</view>
            </view>
        </view>
    </view>
</template>

<script>
export default {
    name: "YkAuthpup",
    props: {
        // 开启动画
        animation: {
            type: Boolean,
            default: true,
        },
        type: {
            type: String,
            default: "top",
        },
        show: {
            type: Boolean,
            default: true,
        },
        //是否是原生头部
        isNativeHead: {
            type: Boolean,
            default: true,
        },
        permissionID: {
            type: [String, Number],
            default: "",
        },
    },
    data() {
        return {
            ani: "",
            showPopup: false,
            StatusBar: "",
            refuseNum: "", //拒绝次数，
            eventChannel: null,
            authList: {
                WRITE_EXTERNAL_STORAGE: {
                    title: "对存储空间/照片权限申请说明",
                    content: "便于您使用该功能上传您的照片/图片/视频及用于更换头像、意见反馈、保存相册、发布商品/分享、下载与客服沟通等场景中读取和写入相册和文件内容。",
                },
                ACCESS_FINE_LOCATION: {
                    title: "对地理位置权限申请说明",
                    content: "便于应用程序可以提供基于位置的服务、定位导航、附近搜索等功能。",
                },
                CAMERA: {
                    title: "对相机/摄像头权限申请说明",
                    content: "便于您使用该功能拍照上传您的照片/视频及用于更换头像、意见反馈、保存相册、发布商品/动态、下载与客服沟通等场景中使用",
                },
                RECORD_AUDIO: {
                    title: "对麦克风权限申请说明",
                    content: "便于您使用该功能进行录音、语音通话、发布语音、与客服语音沟通等场景中使用",
                },
                CALL_PHONE: {
                    title: "对拨打/管理电话权限申请说明",
                    content: "便于您使用该功能联系客服、业务经理与联系等场景下使用",
                },
            },
        };
    },
    onLoad(options) {
        // #ifdef APP-PLUS
        this.getSystemInfo();
        // #endif
        let { permissionID } = options;
        this.permissionID = permissionID;
        this.eventChannel = this.getOpenerEventChannel();
        this.open();
    },
    methods: {
        //获取状态栏高度
        getSystemInfo() {
            let _this = this;
            uni.getSystemInfo({
                success: function (e) {
                    _this.StatusBar = e.statusBarHeight + "px"; //用于自定义头部时，给手机状态栏留出位置,可通过isNativeHead这个参数控制
                },
            });
        },
        open() {
            this.requestPermissions(this.permissionID);
        },
        close(type) {
            this.ani = "";
            this.$nextTick(() => {
                setTimeout(() => {
                    this.showPopup = false;
                }, 300);
            });
        },
        // Android权限查询
        requestAndroidPermission(permissionID) {
            return new Promise((resolve, reject) => {
                plus.android.requestPermissions(
                    [permissionID], // 理论上支持多个权限同时查询，但实际上本函数封装只处理了一个权限的情况。有需要的可自行扩展封装
                    (resultObj) => {
                        for (var i = 0; i < resultObj.granted.length; i++) {
                            var grantedPermission = resultObj.granted[i];
                            console.log("已获取的权限：" + grantedPermission);
                            uni.navigateBack({
                                delta: 1,
                            });
                            // 参数就是上一页面 events 中的方法名
                            this.eventChannel.emit("refreshPage");
                        }
                        for (var i = 0; i < resultObj.deniedPresent.length; i++) {
                            var deniedPresentPermission = resultObj.deniedPresent[i];
                            console.log("拒绝本次申请的权限：" + deniedPresentPermission);
                            //关闭权限申请目的自定义弹框
                            this.ani = "";
                            this.$nextTick(() => {
                                setTimeout(() => {
                                    this.showPopup = false;
                                }, 0);
                            });
                            uni.navigateBack({
                                delta: 1,
                            });
                        }
                        for (var i = 0; i < resultObj.deniedAlways.length; i++) {
                            var deniedAlwaysPermission = resultObj.deniedAlways[i];
                            console.log("永久拒绝申请的权限：" + deniedAlwaysPermission);
                            //当前查询权限已被永久禁用，此时需要引导用户跳转手机系统设置去开启
                            uni.showModal({
                                title: "温馨提示",
                                content: "还没有该权限，立即去设置开启？",
                                cancelText: "取消",
                                confirmText: "去设置",
                                showCancel: true,
                                confirmColor: "#000",
                                cancelColor: "#666",
                                success: (res) => {
                                    if (res.confirm) {
                                        this.goSetting();
                                    }
                                    uni.navigateBack({
                                        delta: 1,
                                    });
                                },
                            });
                        }
                        resolve(result);
                    },
                    function (error) {
                        console.log("申请权限错误：" + error.code + " = " + error.message);
                        resolve({
                            code: error.code,
                            message: error.message,
                        });
                    }
                );
            });
        },
        //权限检测
        async requestPermissions(permissionID) {
            let _this = this;
            // #ifdef APP-PLUS
            //判断安卓与ios设备
            let _permissionID = "android.permission." + permissionID;
            if (plus.os.name == "Android") {
                //打开权限申请目的自定义弹框
                this.showPopup = true;
                this.$nextTick(() => {
                    setTimeout(() => {
                        this.ani = "uni-" + this.type;
                    }, 30);
                });
                await this.requestAndroidPermission(_permissionID);
            } else {
                uni.navigateBack({
                    delta: 1,
                });
                // 参数就是上一页面 events 中的方法名
                this.eventChannel.emit("refreshPage");
            }
            // #endif

            // #ifndef APP-PLUS
            uni.navigateBack({
                delta: 1,
            });
            // 参数就是上一页面 events 中的方法名
            this.eventChannel.emit("refreshPage");
            // #endif
        },
        //跳转手机系统设置
        goSetting() {
            var Intent = plus.android.importClass("android.content.Intent");
            var Settings = plus.android.importClass("android.provider.Settings");
            var Uri = plus.android.importClass("android.net.Uri");
            var mainActivity = plus.android.runtimeMainActivity();
            var intent = new Intent();
            intent.setAction(Settings.ACTION_APPLICATION_DETAILS_SETTINGS);
            var uri = Uri.fromParts("package", mainActivity.getPackageName(), null);
            intent.setData(uri);
            mainActivity.startActivity(intent);
        },
    },
};
</script>
<style lang="scss">
page {
    background: transparent;
}
.uni-popup {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 99999;
    overflow: hidden;
    &__wrapper {
        position: absolute;
        z-index: 999;
        /* #ifndef APP-NVUE */
        box-sizing: border-box;
        /* #endif */
        &.ani {
            /* #ifndef APP-NVUE */
            transition: all 0.3s;
            /* #endif */
        }
        &.top {
            top: 60rpx;
            width: 705rpx;
            /* #ifdef APP-NVUE */
            left: 22.5rpx;
            /* #endif */
            /* #ifndef APP-NVUE */
            left: 0;
            transform: translateY(-705rpx);
            /* #endif */
        }
        &-box {
            position: relative;
            /* #ifndef APP-NVUE */
            box-sizing: border-box;
            /* #endif */
        }
        &.uni-custom {
            & .uni-popup__wrapper-box {
                width: 705rpx;
                /* #ifndef APP-NVUE */
                margin: 0 22.5rpx;
                /* #endif */
                padding: 30upx;
                background: #fff;
                border: solid 2rpx #ddd;
                /* #ifndef APP-NVUE */
                box-sizing: border-box;
                /* #endif */
                border-radius: 16rpx;
                .title {
                    font-size: 32rpx;
                    font-weight: bold;
                }
                .content {
                    margin-top: 16rpx;
                    line-height: 1.6;
                }
            }
            &.top {
                & .uni-popup__wrapper-box {
                    width: 705rpx;
                }
            }
        }
        &.uni-top {
            transform: translateY(0);
        }
    }
}
</style>

```



### pages.json配置：

```json
 {
            "path": "pages/yk_authpup/yk_authpup",
            "style": {
                "app-plus": {
                    "animationDuration": 200,
                    "animationType": "fade-in",
                    "background": "transparent",
                    "backgroundColorTop": "transparent",
                    "popGesture": "none",
                    "scrollIndicator": false,
                    "titleNView": false
                },
                "disableScroll": true
            }
        },
```



### 调用：

```javascript
            uni.navigateTo({
                url: `/pages/yk_authpup/yk_authpup?permissionID=CALL_PHONE`,
                events: {
                    refreshPage: () => {
                        //调用权限申请，已授权
                        this.phoneCall();
                    },
                },
            });
```

