# uniapp腾讯cos桶Put方法直传

>    uni-app 直传实践， 本文档介绍如何不依赖 SDK，使用简单的代码，在 uni-app 直传文件到对象存储（Cloud Object Storage，COS）的存储桶。 



## 表单方式上传

https://cloud.tencent.com/document/product/436/71469



## put方法二进制上传

```javascript
const getContentTypeByFile = (filePath) => {
    if (filePath) {
        let fileType = filePath.split('.').pop();
        fileType = fileType ? fileType.toLowerCase() : filePath;
        switch (fileType) {
            case 'pdf':
                return 'application/pdf';
            case 'jpg':
            case 'jpeg':
                return 'image/jpeg';
            case 'png':
                return 'image/png';
            case 'bmp':
                return 'image/bmp';
            case 'webp':
                return 'image/webp';
            case 'doc':
                return 'application/msword';
            case 'docx':
                return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
            case 'pptx':
                return 'application/vnd.openxmlformats-officedocument.presentationml.presentation';
            case 'text':
                return 'text/plain';
            case 'xls':
                return 'application/vnd.ms-excel';
            case 'xlsx':
                return 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
            case 'zip':
                return 'application/zip';
        }
    }
    return 'application/octet-stream';
};

const getLocalFilePath = (path) => {
	if (path.indexOf('_www') === 0 || path.indexOf('_doc') === 0 || path.indexOf('_documents') === 0 || path
		.indexOf('_downloads') === 0) {
		return path
	}
	if (path.indexOf('file://') === 0) {
		return path
	}
	if (path.indexOf('/storage/emulated/0/') === 0) {
		return path
	}
	if (path.indexOf('/') === 0) {
		const localFilePath = plus.io.convertAbsoluteFileSystem(path)
		if (localFilePath !== path) {
			return localFilePath
		} else {
			path = path.substr(1)
		}
	}
	return '_www/' + path
}

// put上传需要读取文件的真实内容来上传
        plus.io.resolveLocalFileSystemURL(getLocalFilePath(filePath), (entry) => {
            entry.file((file) => {
                const fileReader = new plus.io.FileReader();
                
                fileReader.onloadend  = (data) => {
           
				    let buf = uni.base64ToArrayBuffer(data.target.result.split(",")[1])
                    uni.request({
                        url: url,
                        method: 'PUT',
                        data: buf, // 这里是读取到的文件内容
                        header: {
                            'Content-Type': getContentTypeByFile(filePath)
                        },
                        success(res) {
                            if (res.statusCode === 200) {
                                const result = url.split('?')[0];
                                onOk({
                                    url: result,
                                    fileName
                                });
                            } else {
                                uni.hideLoading();
                                uni.showModal({
                                    title: '上传失败',
                                    content: JSON.stringify(res),
                                    showCancel: false
                                });
                            }
                        },
                        fail(res) {
                            uni.hideLoading();
                            uni.showModal({
                                title: '上传失败',
                                content: JSON.stringify(res),
                                showCancel: false
                            });
                        }
                    });
                };
    
                fileReader.onerror = (error) => {
                    uni.hideLoading();
                    uni.showModal({
                        title: '读取文件失败',
                        content: JSON.stringify(error),
                        showCancel: false
                    });
                };
    
                fileReader.readAsDataURL(file, 'utf-8'); // 读取文件内容为 DataURL
            }, (error) => {
                uni.hideLoading();
                uni.showModal({
                    title: '获取文件失败',
                    content: JSON.stringify(error),
                    showCancel: false
                });
            });
        }, (error) => {
            uni.hideLoading();
            uni.showModal({
                title: '文件路径解析失败',
                content: JSON.stringify(error),
                showCancel: false
            });
        });
```

