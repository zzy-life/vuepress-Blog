# vue如何自动处理静态资源上传至对象存储

> vue如何自动处理静态资源上传至对象存储

例子是腾讯云对象存储，请自行修改



实际情况下，前端项目部署在vercel或者netlify等，国内访问网速很慢，所以通过此方法可以把打包后的dist静态资源（比如js,css,png等）上传到对象存储，达到优化网站速度的目的。



## 依赖

```bash
npm i cos-nodejs-sdk-v5
```



## 上传至COS的脚本文件

### 项目根目录新建文件uploadToCOS.js

自行修改腾讯云密钥和存储桶信息



```
const path = require("path");
const fs = require("fs");
const COS = require("cos-nodejs-sdk-v5");

// 配置腾讯云COS参数
const cos = new COS({
	SecretId: "", // 身份识别 ID
	SecretKey: "", // 身份密钥
});

// 获取dist目录下的所有文件
const dirPath = path.resolve(__dirname, "dist");
// 定义上传到 COS 上的前缀目录
const base = "HomePage/";
// 遍历目录并上传文件
function traverseDirectory(dirPath, prefix = "") {
	const files = fs.readdirSync(dirPath);
	files.forEach((file) => {
		const filePath = path.join(dirPath, file);
		const relativePath = path.relative(dirPath, filePath);
		const cosKey = path.join(prefix, relativePath).replace(/\\/g, "/"); // 使用 / 替换 \，确保在 COS 上是正斜杠

		if (fs.statSync(filePath).isDirectory()) {
			// 如果是目录，则继续遍历子目录，并传入新的前缀
			traverseDirectory(filePath, cosKey);
		} else {
			// 如果是文件，则上传文件
			fs.readFile(filePath, (err, data) => {
				if (err) {
					console.error(`\n读取文件 ${relativePath} 失败：`, err);
					return;
				}

				const params = {
					Bucket: "",//存储桶名
					Region: "",//地域名
					Key: base + cosKey,
					Body: data, // 使用文件内容进行上传
				};

				cos.putObject(params, function (err, data) {
					if (err) {
						console.log(data);
						console.error(`\n上传文件 ${relativePath} 失败：`, err);
					} else {
						console.log(data);
						console.log(`\n上传文件 ${relativePath} 成功`);
					}
				});
			});
		}
	});
}

// 开始遍历上传
traverseDirectory(dirPath);

```



### 修改package.json

在build命令后面增加 && node uploadToCOS.js

列如：

vue2+vuecli

```bash
"scripts": {
        "dev": "vue-cli-service serve",
        "build": "vue-cli-service build && node  uploadToCOS.js"
    },
```

vue3+vite

```bash
 "scripts": {
    "dev": "vite  --mode dev",
    "serve": "vite --mode prod",
    "build": "vite build --mode prod && node uploadToCOS.js",
    "lint": "eslint . --ext .vue,.js,.ts,.jsx,.tsx --fix"
  },
```





## vue2+vuecli

修改vue.config.js文件

请自行做开发环境 / 生产环境判断

```js
 publicPath: 'https://...', //vue-cli3.3+新版本使用，修改为你的对象存储url
```



## vue3+vite

修改vite.config.ts文件

```js
const host  = "https://..." //你的对象存储url

// 为生产环境静态资源设置不同的路径，请先运行uploadToCOS.js上传静态资源到COS
  experimental: {
    renderBuiltUrl(filename: string, { hostId, hostType, type }: { hostId: string, hostType: 'js' | 'css' | 'html', type: 'public' | 'asset' }) {
        return host + filename
    }
  }
```

