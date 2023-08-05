# pdf转换word

> springboot pdf转换word

## 源码

```java
public static void main(String[] args)

	{

		String sourceFile = "C:\\Users\\zzy1998\\Desktop\\text\\ceshi\\微信小程序大赛文档_青涟环保.pdf";// 输入的文件
		String targetFile = "C:\\Users\\zzy1998\\Desktop\\text\\ceshi\\转换后.docx";// 输出的文件
		try {
			long old = System.currentTimeMillis();
			FileOutputStream os = new FileOutputStream(targetFile);
			com.aspose.pdf.Document doc = new com.aspose.pdf.Document(sourceFile);// 加载源文件数据
			doc.save(os, com.aspose.pdf.SaveFormat.DocX);// 设置转换文件类型并转换
			os.close();
			long now = System.currentTimeMillis();
			System.out.println("共耗时：" + ((now - old) / 1000.0) + "秒"); // 转化用时
		} catch (Exception e) {
			e.printStackTrace();
		}

	}
```

## 依赖

 aspose-pdf

这个依赖有商业版和免费版  免费版限制了页数还加了水印

商业版需要自己破解  

## 破解教程

引入依赖

```xml
<dependency>
    <groupId>org.javassist</groupId>
    <artifactId>javassist</artifactId>
    <version>3.27.0-GA</version>
</dependency>
```

 修改指定类中的返回值 

```java
	public static void main(String[] args) throws NotFoundException, CannotCompileException, IOException {
		try {
			// 这一步是完整的jar包路径,选择自己解压的jar目录
			ClassPool.getDefault().insertClassPath("C:\\Users\\zzy1998\\Desktop\\text\\beifen\\aspose-pdf-21.11.jar");
			// 获取指定的class文件对象
			CtClass zzZJJClass = ClassPool.getDefault().getCtClass("com.aspose.pdf.ADocument");
			// 从class对象中解析获取所有方法
			CtMethod[] methodA = zzZJJClass.getDeclaredMethods();
			for (CtMethod ctMethod : methodA) {
				// 获取方法获取参数类型
				CtClass[] ps = ctMethod.getParameterTypes();
				// 筛选同名方法，入参是Document
				if (ps.length == 0 && (ctMethod.getName().equals("lj") || ctMethod.getName().equals("lt"))) {
					ctMethod.setBody("{return true;}");
				}
				if (ps.length == 1 && (ctMethod.getName().equals("lI"))
						&& ps[0].getName().equals("com.aspose.pdf.internal.l10k.ly")) {
					ctMethod.setBody("{return true;}");
				}
			}
			// 这一步就是将破译完的代码放在桌面上
			zzZJJClass.writeFile("C:\\Users\\zzy1998\\Desktop\\text");

		} catch (Exception e) {
			System.out.println("错误==" + e);
		}

	}
```

1. 把aspose-pdf-21.11.jar后缀改成rar/zip等能解压的格式，解压为aspose-pdf-21.11（文件名随意）
2. 把刚刚生成文件替换到com.aspose.pdf中
3. 删除aspose-pdf-21.11.jar中META-INF中的.RSA和.SF后缀的文件
4. 将生成的jar文件放到maven库中，mvn install:install-file -Dfile="C:\Users\zzy1998\Desktop\text\aspose-pdf-21.11.jar" -DgroupId=com.aspose -DartifactId=aspose-pdf -Dversion=21.11 -Dpackaging=jar



[破解教程地址](https://www.jianshu.com/p/5a90d17852ce)

[破解教程](https://blog.csdn.net/qq_24084605/article/details/116012644)
