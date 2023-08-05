# ppt转换pdf

> springboot ppt转换pdf

## 源码

```java
public static void main(String[] args)

	{

		String sourceFile = "C:\\Users\\zzy1998\\Desktop\\老电脑桌面文件夹\\青涟\\微信小程序大赛\\青涟环保答辩稿0716.pptx";// 输入的文件
		String targetFile = "C:\\Users\\zzy1998\\Desktop\\text\\ceshi\\转换后.pdf";// 输出的文件
		try {
			InputStream is = new FileInputStream(new File("C:\\Users\\zzy1998\\Desktop\\text\\beifen\\license.xml"));
			License license = new License();
			license.setLicense(is);
			long old = System.currentTimeMillis();
			FileOutputStream os = new FileOutputStream(targetFile);
			Presentation ppt = new Presentation(sourceFile);// 加载源文件数据
			ppt.save(os, com.aspose.slides.SaveFormat.Pdf);// 设置转换文件类型并转换
			os.close();
			long now = System.currentTimeMillis();
			System.out.println("共耗时：" + ((now - old) / 1000.0) + "秒"); // 转化用时
		} catch (Exception e) {
			e.printStackTrace();
		}

	}
```

## 依赖

 aspose-Slides 

这个依赖有商业版和免费版  免费版限制了页数还加了水印

商业版需要自己破解  

license文件

```xml
<License>
    <Data>
        <Products>
            <Product>Aspose.Total for Java</Product>
            <Product>Aspose.Words for Java</Product>
        </Products>
        <EditionType>Enterprise</EditionType>
        <SubscriptionExpiry>20991231</SubscriptionExpiry>
        <LicenseExpiry>20991231</LicenseExpiry>
        <SerialNumber>8bfe198c-7f0c-4ef8-8ff0-acc3237bf0d7</SerialNumber>
    </Data>
    <Signature>
        sNLLKGMUdF0r8O1kKilWAGdgfs2BvJb/2Xp8p5iuDVfZXmhppo+d0Ran1P9TKdjV4ABwAgKXxJ3jcQTqE/2IRfqwnPf8itN8aFZlV3TJPYeD3yWE7IT55Gz6EijUpC7aKeoohTb4w2fpox58wWoF3SNp6sK6jDfiAUGEHYJ9pjU=
    </Signature>
</License>
```



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
			ClassPool.getDefault()
					.insertClassPath("C:\\Users\\zzy1998\\Desktop\\text\\beifen\\aspose-slides-21.10-jdk16.jar");
			CtClass zzZJJClass = ClassPool.getDefault().getCtClass("com.aspose.slides.internal.of.public");
			CtMethod[] methodA = zzZJJClass.getDeclaredMethods();
			for (CtMethod ctMethod : methodA) {
				CtClass[] ps = ctMethod.getParameterTypes();
				if (ps.length == 3 && ctMethod.getName().equals("do")) {
					System.out.println("ps[0].getName==" + ps[0].getName());
					ctMethod.setBody("{}");
				}
			}
			// 这一步就是将破译完的代码放在桌面上
			zzZJJClass.writeFile("C:\\Users\\zzy1998\\Desktop\\text");
		} catch (Exception e) {
			System.out.println("错误==" + e);
		}

	}
```

1. 把aspose-slides-21.10-jdk16.jar后缀改成rar/zip等能解压的格式，解压为aspose-slides-21.10-jdk16（文件名随意）
2. 把刚刚生成文件替换到com.aspose.slides中
3. 删除aspose-slides-21.10-jdk16.jar中META-INF中的.RSA和.SF后缀的文件
4. 将生成的jar文件放到maven库中，mvn install:install-file -Dfile="C:\Users\zzy1998\Desktop\text\aspose-slides-21.10-jdk16.jar" -DgroupId=com.aspose -DartifactId=aspose-slides -Dversion=21.10 -Dpackaging=jar



[破解教程地址](https://www.jianshu.com/p/5a90d17852ce)

[破解教程](https://blog.csdn.net/qq_24084605/article/details/116012644)
