# word上传解析成html

> springboot word上传解析成html

项目依赖若依vue分离版

如代码依赖缺少，可百度若依vue版参考代码

## 下载依赖

- poi 3.12
- poi-scratchpad 3.12
- aspose-words-15.8.0-jdk16 15.8.0

aspose-words下载不到请使用百度网盘下载

[链接](https://pan.baidu.com/s/1kAMSvfXdpiJgObvezoJ0dw )
提取码：HWSB

### 在项目路径下新建lib目录，并将本地引入的jar包拷贝进去

更改pom.xml

```xml
 <!-- word文档处理 -->
	    	 <dependency>
	            <groupId>com.aspose</groupId>
	            <artifactId>aspose-words</artifactId>
	            <version>15.8.0</version>
	            <scope>system</scope>
	            <systemPath>${project.basedir}/lib/aspose-words-15.8.0-jdk16.jar</systemPath>
	        </dependency>
```

### 修改pom文件配置打包

这里的关键配置是<includeSystemScope>true</includeSystemScope>这句话，使得打包的时候，能够将本地jar包一起包含

```xml
<build>
  <finalName>${project.artifactId}</finalName>
  <plugins>
      <plugin>
          <groupId>org.springframework.boot</groupId>
          <artifactId>spring-boot-maven-plugin</artifactId>
          <configuration>
              <fork>true</fork> <!-- 如果没有该配置，devtools不会生效 -->
              <includeSystemScope>true</includeSystemScope>
          </configuration>
      </plugin>
  </plugins>
</build>

```

> 注意！jar包版本不可变更

## 配置类及Controller编写

### 配置类

- InfoCode

```java
public class InfoCode {

    public static Integer SUCCESS = 200;

    public static Integer ERROR = 500;

    public static Integer INVALID_TOKEN = 30;
}
```

- RespInfo

```java
@Data
public class RespInfo {
    private Integer status;

    private Object content;

    private String message;

    public RespInfo() {
    }


    public RespInfo(Integer status, Object content, String message) {
        this.status = status;
        this.content = content;
        this.message = message;
    }

    public RespInfo(Integer status, Object content) {
        this.status = status;
        this.content = content;
    }


}
```



### Controller

```java
@Controller
@RequestMapping(value = "api/upload/word")
public class Word2htmlController {
	// 上传文件路径
	String path = RuoYiConfig.getProfile();

	// 百度富文本Word图片解析网址路径
	String domainname = RuoYiConfig.getDomainname();

	@Autowired
	private ServerConfig serverConfig;

	@RequestMapping("/template")
	@ResponseBody
	public String parseDocToHtml(@RequestParam("file") MultipartFile file)
			throws IOException, ParserConfigurationException, TransformerException {
		// 上传并返回新文件名称
		String fileName = FileUploadUtils.upload(path, file);
		// 截掉url地址中不需要的(返回值对应上传文件路径)
		// （如改动后端项目路径地址，此处需修改）
		// 还需修改common.constant包RESOURCE_PREFIX
		fileName = fileName.replace("/xyw/profile/", "");
		// 生成文件路径
		InputStream input = new FileInputStream(path + fileName);
		// 截取文件格式名
		String suffix = fileName.substring(fileName.indexOf(".") + 1);
		if ("docx".equals(suffix)) {
			// 调用解析方法
			String content = parseDocxToHtml(fileName);
			// 图片地址转换
			String newstr = content.replace(path, domainname);
			return newstr;
		}
		/* 以下是doc处理方法 */
		// 实例化WordToHtmlConverter，为图片等资源文件做准备
		WordToHtmlConverter wordToHtmlConverter = new WordToHtmlConverter(
				DocumentBuilderFactory.newInstance().newDocumentBuilder().newDocument());
		// 处理图片
		wordToHtmlConverter.setPicturesManager(new PicturesManager() {
			public String savePicture(byte[] content, PictureType pictureType, String suggestedName, float widthInches,
					float heightInches) {
				// 根据地址通过流获取文件
				File imgfile = new File(suggestedName);
				OutputStream output = null;
				BufferedOutputStream bufferedOutput = null;
				try {
					output = new FileOutputStream(imgfile);
					bufferedOutput = new BufferedOutputStream(output);
					bufferedOutput.write(content);
				} catch (Exception e) {
					e.printStackTrace();
				} finally {
					try {
						bufferedOutput.close();
						output.close();
					} catch (Exception e) {
						e.printStackTrace();
					}
				}
				// 上传文件路径
				String filePath = RuoYiConfig.getUploadPath();
				// 上传并返回新文件名称
				FileItem fileItem = createFileItem(imgfile);
				// 格式转换
				MultipartFile multipartFile = new CommonsMultipartFile(fileItem);

				try {
					// 执行上传文件方法
					String fileName = FileUploadUtils.upload(filePath, multipartFile);
					String url = serverConfig.getUrl() + fileName;
					imgfile.delete();
					// 返回url地址给文档
					return url;
				} catch (IOException e) {
					// TODO 自动生成的 catch 块
					imgfile.delete();
					return suggestedName;
				}

			}
		});
		if ("doc".equals(suffix.toLowerCase())) {
			// doc
			HWPFDocument wordDocument = new HWPFDocument(input);
			wordToHtmlConverter.processDocument(wordDocument);
			// 处理图片，会在同目录下生成并保存图片
			List pics = wordDocument.getPicturesTable().getAllPictures();
			if (pics != null) {
				for (int i = 0; i < pics.size(); i++) {
					Picture pic = (Picture) pics.get(i);
					try {
						pic.writeImageContent(new FileOutputStream(path + pic.suggestFullFileName()));
					} catch (FileNotFoundException e) {
						e.printStackTrace();
					}
				}
			}
		}

		String content = conversion(wordToHtmlConverter);
		RespInfo respInfo = new RespInfo();
		if (content != null) {
			// 图片url地址转换
			String newstr = content.replace(path, domainname);

			respInfo.setContent(newstr);
			respInfo.setMessage("success");
			respInfo.setStatus(InfoCode.SUCCESS);
		} else {
			respInfo.setMessage("error");
			respInfo.setStatus(InfoCode.ERROR);
		}
		return JSON.toJSONString(respInfo);
	}

	private String parseDocxToHtml(String fileName) throws IOException {
		RespInfo respInfo = new RespInfo();
		File file = new File(path + fileName);
		System.out.println(file);
		if (!file.exists()) {
			respInfo.setStatus(InfoCode.ERROR);
			respInfo.setMessage("Sorry File does not Exists!");
			return JSON.toJSONString(respInfo);
		}
		if (file.getName().endsWith(".docx") || file.getName().endsWith(".DOCX")) {
			// 1) 加载XWPFDocument及文件
			InputStream in = new FileInputStream(file);

			XWPFDocument document = new XWPFDocument(in);
			document.createNumbering();
			// 2) 实例化XHTML内容(这里将会把图片等文件放到同级目录下)
			File imageFolderFile = new File(path + "/word/" + UUID.fastUUID());// 根据路径和名字随机生成图片文件路径
			XHTMLOptions options = XHTMLOptions.create().URIResolver(new FileURIResolver(imageFolderFile));
			// 存放图片的文件夹
			options.setExtractor(new FileImageExtractor(imageFolderFile));
			options.setIgnoreStylesIfUnused(false);
			options.setFragment(true);

			// 3) 将XWPFDocument转成XHTML并生成文件 --> 我此时不想让它生成文件,所以我注释掉了,按需求定
			/*
			 * OutputStream out = new FileOutputStream(new File( path, "result.html"));
			 * XHTMLConverter.getInstance().convert(document, out, null);
			 */
			ByteArrayOutputStream baos = new ByteArrayOutputStream();
			XHTMLConverter.getInstance().convert(document, baos, options);
			String content = baos.toString();
			// content =
			// Pattern.compile("width:\\d*[.]\\d*pt;").matcher(content).replaceAll("592.0pt;");595.0pt
			content = compile(content);
			baos.close();
			respInfo.setMessage("success");
			respInfo.setStatus(InfoCode.SUCCESS);
			// respInfo.setContent("<div style=\"width: 595.0pt; margin: -72.0pt -90.0pt
			// -72.0pt -90.0pt !important;\">"+content+"</div>");
			respInfo.setContent(content);
			return JSON.toJSONString(respInfo);
		} else {
			System.out.println("Enter only MS Office 2007+ files");
		}
		return null;
	}

	private String compile(String content) {
		content = Pattern.compile("width:595.0pt;").matcher(content).replaceAll("");
		content = Pattern.compile("width:593.0pt;").matcher(content).replaceAll("");
		content = Pattern.compile("margin-left:\\d*[.]\\d*pt;").matcher(content).replaceAll("");
		content = Pattern.compile("margin-right:\\d*[.]\\d*pt;").matcher(content).replaceAll("");
		return content;
	}

	private String conversion(WordToHtmlConverter wordToHtmlConverter) throws TransformerException, IOException {
		Document htmlDocument = wordToHtmlConverter.getDocument();
		ByteArrayOutputStream outStream = new ByteArrayOutputStream();
		DOMSource domSource = new DOMSource(htmlDocument);
		StreamResult streamResult = new StreamResult(outStream);
		TransformerFactory tf = TransformerFactory.newInstance();
		Transformer serializer = tf.newTransformer();
		serializer.setOutputProperty(OutputKeys.ENCODING, "utf-8");// 编码格式
		serializer.setOutputProperty(OutputKeys.INDENT, "yes");// 是否用空白分割
		serializer.setOutputProperty(OutputKeys.METHOD, "html");// 输出类型
		serializer.transform(domSource, streamResult);
		outStream.close();
		String content = new String(outStream.toByteArray());
		// 我此时不想让它生成文件,所以我注释掉了,按需求定
		/*
		 * FileUtils.writeStringToFile(new File(path, "interface.html"), content,
		 * "utf-8");
		 */
		return content;
	}

	private static FileItem createFileItem(File file) {
		FileItemFactory factory = new DiskFileItemFactory(16, null);
		FileItem item = factory.createItem("textField", "text/plain", true, file.getName());
		int bytesRead = 0;
		byte[] buffer = new byte[8192];
		try {
			FileInputStream fis = new FileInputStream(file);
			OutputStream os = item.getOutputStream();
			while ((bytesRead = fis.read(buffer, 0, 8192)) != -1) {
				os.write(buffer, 0, bytesRead);
			}
			os.close();
			fis.close();
		} catch (IOException e) {
			e.printStackTrace();
		}
		return item;
	}

}
```

## 常见问题

### 若依poi的jar包版本过高

修改com.ruoyi.common.utils.poi的ExcelUtil

createStyles方法

```java
/**
	 * 创建表格样式
	 * 
	 * @param wb 工作薄对象
	 * @return 样式列表
	 */
	private Map<String, CellStyle> createStyles(Workbook wb) {
		// 写入各条记录,每条记录对应excel表中的一行
		Map<String, CellStyle> styles = new HashMap<String, CellStyle>();
		CellStyle style = wb.createCellStyle();
		style.setAlignment(CellStyle.ALIGN_CENTER);
		style.setVerticalAlignment(CellStyle.VERTICAL_CENTER);
		style.setBorderRight(CellStyle.BORDER_THIN);
		style.setRightBorderColor(IndexedColors.GREY_50_PERCENT.getIndex());
		style.setBorderLeft(CellStyle.BORDER_THIN);
		style.setLeftBorderColor(IndexedColors.GREY_50_PERCENT.getIndex());
		style.setBorderTop(CellStyle.BORDER_THIN);
		style.setTopBorderColor(IndexedColors.GREY_50_PERCENT.getIndex());
		style.setBorderBottom(CellStyle.BORDER_THIN);
		style.setBottomBorderColor(IndexedColors.GREY_50_PERCENT.getIndex());
		Font dataFont = wb.createFont();
		dataFont.setFontName("Arial");
		dataFont.setFontHeightInPoints((short) 10);
		style.setFont(dataFont);
		styles.put("data", style);

		style = wb.createCellStyle();
		style.cloneStyleFrom(styles.get("data"));
		style.setAlignment(CellStyle.ALIGN_CENTER);
		style.setVerticalAlignment(CellStyle.VERTICAL_CENTER);
		style.setFillForegroundColor(IndexedColors.GREY_50_PERCENT.getIndex());
		style.setFillPattern(CellStyle.SOLID_FOREGROUND);
		Font headerFont = wb.createFont();
		headerFont.setFontName("Arial");
		headerFont.setFontHeightInPoints((short) 10);
		headerFont.setBold(true);
		headerFont.setColor(IndexedColors.WHITE.getIndex());
		style.setFont(headerFont);
		styles.put("header", style);

		style = wb.createCellStyle();
		style.setAlignment(CellStyle.ALIGN_CENTER);
		style.setVerticalAlignment(CellStyle.VERTICAL_CENTER);
		Font totalFont = wb.createFont();
		totalFont.setFontName("Arial");
		totalFont.setFontHeightInPoints((short) 10);
		style.setFont(totalFont);
		styles.put("total", style);

		style = wb.createCellStyle();
		style.cloneStyleFrom(styles.get("data"));
		style.setAlignment(CellStyle.ALIGN_LEFT);
		styles.put("data1", style);

		style = wb.createCellStyle();
		style.cloneStyleFrom(styles.get("data"));
		style.setAlignment(CellStyle.ALIGN_CENTER);
		styles.put("data2", style);

		style = wb.createCellStyle();
		style.cloneStyleFrom(styles.get("data"));
		style.setAlignment(CellStyle.ALIGN_RIGHT);
		styles.put("data3", style);

		return styles;
	}
```

> 核心就是将样式**HorizontalAlignment**修改为相应版本的**CellStyle.ALIGN_CENTER**

