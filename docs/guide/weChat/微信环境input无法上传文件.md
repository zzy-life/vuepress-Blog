# 微信环境input无法上传文件

> 微信环境中使用H5的input file时只能选择手机的图片，不能选择文件上传

微信中使用input type=”file”做文件上传，accept属性没有限制为image，但是在微信浏览器内只能选择手机内存里的图片，不能文档等文件。经测试，在ios上只能选择图片，安卓机上有部分可以选择文档、部分只能选择图片，选择不上非图片格式的文件（默认灰色），但是在浏览器中是正常的，经过测试发现是”accept”属性的问题。

先举个简单的例子说一下：
以下这个写法在pc端是可以识别的，可以调起选择器，但在移动端是无法识别的。

```html
<input type="file" accept=".jpg,.png,.gif"/>
```

移动端需要换成下面的写法就可以识别到了。

```html
<input type="file" accept="image/jpeg,image/png,image/gif"/>
```

注：如果不限制图像的格式，可以写为：accept=”image/*”。

以下是移动端文件上传input=file,accept=””的一些属性（苹果，安卓）:

.xls

```html
<input type="file" accept="application/vnd.ms-excel" />
```

.xlsx

```html
<input type="file" accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" />
```

.ppt

```html
<input type="file" accept="application/vnd.ms-powerpoint" />
```

.pptx

```html
<input type="file" accept="application/vnd.openxmlformats-officedocument.presentationml.presentation" />
```

.doc

```html
<input type="file" accept="application/msword" />
```

.docx

```html
<input type="file" accept="application/vnd.openxmlformats-officedocument.wordprocessingml.document" />
```

.pdf

```html
<input type="file" accept="application/pdf" />
```

.csv

```html
<input type="file" accept=".csv" />
```

.png/.jpg/.jpeg/.etc

```html
<input type="file" accept="image/*" />
```

.txt

```html
<input type="file" accept="text/plain" />
```

.htm/.html

```html
<input type="file" accept="text/html" />
```

.avi/.mpg/.mpeg/.mp4

```html
<input type="file" accept="video/*" />
```

.mp3/.wav/.etc

```html
<input type="file" accept="audio/*" />
```

.zip

```html
<input type="file" accept="application/x-zip-compressed" />
```

以下是完整的方案：

```html
<input type="file" accept="application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/pdf,.csv,image/*,text/plain,video/*,audio/*,application/x-zip-compressed" />
```