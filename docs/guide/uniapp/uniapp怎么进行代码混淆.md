# uniapp怎么进行代码混淆

>  在UniApp中进行代码混淆可以帮助保护应用代码，防止被他人轻易反编译或者盗用。以下是一个简单的指南，介绍如何在UniApp中进行代码混淆



## 下载插件

```
npm i webpack-obfuscator@2.6
```



## 新建vue.config.js

打包后会执行webpack-obfuscator对js代码进行混淆

```javascript

module.exports = {  
    configureWebpack: config => {
		if (process.env.NODE_ENV === 'production'&&process.env.UNI_PLATFORM === 'app-plus') {
			var JavaScriptObfuscator = require('webpack-obfuscator');
			config.plugins.push(
				new JavaScriptObfuscator({
					// 压缩代码（uniApp不能加）  
					// compact: true,  
					// 是否启用控制流扁平化(降低1.5倍的运行速度)  
					// controlFlowFlattening: true,  
					// 随机的死代码块(增加了混淆代码的大小)  
					deadCodeInjection: false,  
					// 死代码块的影响概率(uniApp不能加)  
					// deadCodeInjectionThreshold: 0.4,  
					// 此选项几乎不可能使用开发者工具的控制台选项卡  
					debugProtection: false,
					// 如果选中，则会在“控制台”选项卡上使用间隔强制调试模式，从而更难使用“开发人员工具”的其他功能。
					debugProtectionInterval: false,
					// 通过用空函数替换它们来禁用console.log，console.info，console.error和console.warn。这使得调试器的使用更加困难  
					disableConsoleOutput: false,  
					// 标识符的混淆方式 hexadecimal(十六进制) mangled(短标识符)  
					identifierNamesGenerator: 'hexadecimal',  
					// 打包是否展示log  
					log: true,  
					// 是否启用全局变量和函数名称的混淆  
					// renameGlobals: false,  
					/**  
					 * 通过固定和随机（在代码混淆时生成）的位置移动数组。这使得将删除的字符串的顺序与其原始位置相匹配变得更加困难。  
					 * 如果原始源代码不小，建议使用此选项，因为辅助函数可以引起注意。  
					 */  
					rotateStringArray: true,  
					// 混淆后的代码,不能使用代码美化,同时需要配置 cpmpat:true; （uniApp不能加）  
					// selfDefending: true,  
					// 删除字符串文字并将它们放在一个特殊的数组中  
					stringArray: true,  
					stringArrayEncoding: ['base64'],  
					stringArrayThreshold: 0.75,  
					transformObjectKeys: false,  
					/**  
					 * 允许启用/禁用字符串转换为unicode转义序列。Unicode转义序列大大增加了代码大小，  
					 * 并且可以轻松地将字符串恢复为原始视图。建议仅对小型源代码启用此选项。  
					 */  
					// unicodeEscapeSequence: false  
				}, [ // 要忽略的js文件
					'aaa.js',
					'bbb.js',
				])
			)
		}
	},
}
```

