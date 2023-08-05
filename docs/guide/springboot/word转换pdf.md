# word转换pdf

> springboot word转换pdf

## 源码

```java
public class Test01 {
    public static void main(String[] args) throws Exception {
        Test01 test01 = new Test01();
        test01.file2pdf("F:\\","AA",".docx");
    }
    /**
     *
     * @param toFilePath 文件夹路径
     * @param fileName 文件名
     * @param type 文件类型
     * @return
     * @throws Exception
     */
    public String file2pdf(String toFilePath, String fileName, String type ) throws Exception {
        String htmFileName;
        //获取转换成PDF之后文件名
        if(".doc".equals(type)){
            htmFileName = fileName+".pdf";
        }else if(".docx".equals(type)){
            htmFileName = fileName+".pdf";
        }else{
            return null;
        }
        //通过转换之后的PDF文件名,创建PDF文件
        File htmlOutputFile = new File(toFilePath + File.separatorChar + htmFileName);
        //获取文件输出流
        FileOutputStream os = new FileOutputStream(htmlOutputFile);
        //获取Doc文档对象模型
        Document doc = new Document(toFilePath+ File.separatorChar + fileName+type);
        //为doc文档添加水印
        insertWatermarkText(doc, "于文珂");
        //将doc文旦转换成PDF文件并输出到之前创建好的pdf文件中
        doc.save(os, SaveFormat.PDF);
        //关闭输出流
        if(os!=null){
            os.close();
        }
        return htmFileName;
    }

    /**
     * 为word文档添加水印
     * @param doc word文档模型
     * @param watermarkText 需要添加的水印字段
     * @throws Exception
     */
    private static void insertWatermarkText(Document doc, String watermarkText) throws Exception {
        Shape watermark = new Shape(doc, ShapeType.TEXT_PLAIN_TEXT);
        //水印内容
        watermark.getTextPath().setText(watermarkText);
        //水印字体
        watermark.getTextPath().setFontFamily("宋体");
        //水印宽度
        watermark.setWidth(500);
        //水印高度
        watermark.setHeight(100);
        //旋转水印
        watermark.setRotation(-40);
        //水印颜色
        watermark.getFill().setColor(Color.lightGray);
        watermark.setStrokeColor(Color.lightGray);
        watermark.setRelativeHorizontalPosition(RelativeHorizontalPosition.PAGE);
        watermark.setRelativeVerticalPosition(RelativeVerticalPosition.PAGE);
        watermark.setWrapType(WrapType.NONE);
        watermark.setVerticalAlignment(VerticalAlignment.CENTER);
        watermark.setHorizontalAlignment(HorizontalAlignment.CENTER);
        Paragraph watermarkPara = new Paragraph(doc);
        watermarkPara.appendChild(watermark);
        for (Section sect : doc.getSections())
        {
            insertWatermarkIntoHeader(watermarkPara, sect, HeaderFooterType.HEADER_PRIMARY);
            insertWatermarkIntoHeader(watermarkPara, sect, HeaderFooterType.HEADER_FIRST);
            insertWatermarkIntoHeader(watermarkPara, sect, HeaderFooterType.HEADER_EVEN);
        }
        System.out.println("Watermark Set");
    }

    /**
     * 在页眉中插入水印
     * @param watermarkPara
     * @param sect
     * @param headerType
     * @throws Exception
     */
    private static void insertWatermarkIntoHeader(Paragraph watermarkPara, Section sect, int headerType) throws Exception{
        HeaderFooter header = sect.getHeadersFooters().getByHeaderFooterType(headerType);
        if (header == null)
        {
            header = new HeaderFooter(sect.getDocument(), headerType);
            sect.getHeadersFooters().add(header);
        }
        header.appendChild(watermarkPara.deepClone(true));
    }
}
```

## 依赖

 aspose-words 

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
		ClassPool.getDefault().insertClassPath("/Volumes/KESU/安装程序/aspose-words-20.12.0-java/lib/aspose-words-20.12.0-jdk17.jar");
		CtClass zzZJJClass = ClassPool.getDefault().getCtClass("com.aspose.words.zzZDZ");//找到指定类
        //找到指定方法
		CtMethod zzZ4u = zzZJJClass.getDeclaredMethod("zzZ4n");
		CtMethod zzZ4t = zzZJJClass.getDeclaredMethod("zzZ4m");
        //修改返回值
		zzZ4u.setBody("{return 1;}");
		zzZ4t.setBody("{return 1;}");
        //输出到指定路径
		zzZJJClass.writeFile("/Volumes/KESU/安装程序/aspose-words-20.12.0-java/");
	}
```

1. 把aspose-words-20.12.0-jdk17.jar后缀改成rar/zip等能解压的格式，解压为aspose-words-20.12.0-jdk17（文件名随意）
2. 把刚刚生成zzZDz.class文件替换到com.aspose.words中
3. 删除aspose-words-20.12.0-jdk17中META-INF中的.RSA和.SF后缀的文件
4. 进入aspose-words-20.12.0-jdk17的根目录，执行命令jar cvfm aspose-words-20.12-jdk17-crack.jar META-INF/MANIFEST.MF com/ 
5. 将生成的jar文件放到maven库中，mvn install:install-file -Dfile="/Volumes/KESU/安装程序/aspose-words-20.12.0-java/lib/aspose-words-20.12-jdk17-crack.jar" -DgroupId=com.aspose -DartifactId=aspose-words -Dversion=20.12 -Dpackaging=jar



[破解教程地址](https://www.jianshu.com/p/5a90d17852ce)

[破解教程](https://blog.csdn.net/qq_24084605/article/details/116012644)
