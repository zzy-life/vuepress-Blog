# java打包exe可执行文件

> java打包exe可执行文件



jdk版本过高没有jre可以使用命令：

```bash
jlink.exe --module-path jmods --add-modules java.sql,java.desktop --output jre
```

## 步骤

### 将自己的程序打包成jar包

将自己的程序打包成jar包，java -jar jar包 没有问题之后，将cmd窗口关闭进行后续操作

### 下载安装exe4j和inno setup complier

 **exe4j**：将jar转换成exe的工具

链接: https://pan.baidu.com/s/1AXaXeawYC0mcDUlSSMGvXw

提取码: smb7

注意：exe4j要用注册码激活，不然会有弹窗

注册码：

```
A-XVK258563F-1p4lv7mg7sav

A-XVK209982F-1y0i3h4ywx2h1

A-XVK267351F-dpurrhnyarva
```

**inno setup**：将jre和exe打包成一个安装程序的工具，

链接: https://pan.baidu.com/s/1DByTUoOBmo8h-n_A2s6jCw

提取码: 9hzj

这两个工具自己安装之后进行使用：

### exe4j

> 重要！这个软件里指定jre路径  指定软件图标ico都要用相对路径  比如使用./jre
>
> 如果这样写了运行不了  就把jre文件夹复制到exe4j根目录  图标同理

选择“jar in exe” mode 选项，

 **![img](image/1553090-20210716180423941-410981108.png)**

 **5. 输入名称和输出路径，下一步。**

**![img](image/1553090-20210716180443350-555162297.png)**

 **6. 选择GUI，输入应用名称，设置应用图标，下一步。**

![img](image/1553090-20210716180518925-1295720547.png)

 注意：这里选择**GUI程序**，并且勾选下面的Allow -console

**7. 选中“32-bit or 64-bit”，勾选“generate 64-bit executable”，下一步**

**![img](image/1553090-20210716180654663-299288087.png)**

 注意：因为医院的系统有XP 32位，win7 win8 64位的，所以我是分两次打的exe  一个EMRBrower.exe和EMRBrower32.exe 若是打64位的就勾选，若是打32位的就不用勾选

**8. 再VM Parameters输入“ -Dappdir=${EXE4J_EXEDIR} ”，点击绿色+号**

  在VM参数配置的地方加上：-Dfile.encoding=utf-8 

**![img](image/1553090-20210716180857504-1314093478.png)**

 **9. 选择jar包路径，自己的jar包，OK。**

![img](image/1553090-20210716180916949-923019642.png)

 **10. 选择应用程序的主类（含main方法），下一步。**

 注意：这里一定选择**第三个JarLauncher**，我第一次的时候选择的是最后一个，运行不了报错提示找不类

**![img](image/1553090-20210716180957014-939406299.png)**

**11. 选择jdk版本。**

 ![img](image/26099337-b4b7f843177ef415.png) 



**12. 选中“ Search sequence ”，选中绿色+号添加jre目录。**

**![img](image/1553090-20210716181205153-1173360511.png)**

**13. 选择“ Directory ”，目录输入“ .\jre ”，下一步。**

**![img](image/1553090-20210716181226965-1155472237.png)**

![img](image/1553090-20210716181233598-1669955477.png)

此项设置并不会把jdk打包进exe中，只是一个相对jdk路径设置。

例如本次设置需要在exe同级目录下有jdk文件夹，并且文件夹名需要相同。

ps：此路径可有手动输入

**14. 选择“ Client hotspot VM ”，下一步。**

**![img](image/1553090-20210716181253696-560608095.png)**

 **15. 一直下一步，等待绿色进度条完成，在输出目录里面多了一个可运行程序**

**![img](image/1553090-20210716181313618-1904052289.png)**

 **16. 点击“ Click Here to Start the Application ”即可运行程序**

注意：这里最好不要点，因为这个是运行程序，之后全部弄完之后再运行的时候可能端口冲突，导致最后的exe运行不起来

![img](image/1553090-20210716181505045-547157598.png)

###  **inno setup complier** 

中文版界面

 **17. 打开第二个软件：inno setup complier软件，File -> new，下一步，填写配置，应用名称，版本等，下一步。**

 ![img](image/07201044-a8e02c010ca54216b4de01f388218286.png) 

 **18. 默认，下一步。**

 ![img](image/07201112-488851f9ebde49ea8c5242ebab7af35c.png) 

 **19. 选择exe程序，下一步。**

注意：这里选择第一个软件exe4j生成的那个exe

**![img](image/1553090-20210716181605166-56896017.png)**

 **20. 默认，下一步。**

 ![img](image/07201200-d5e3f7f7a41040efa68ce180a34b1f54.png) 

**21. 许可申明，可不填继续下一步。**

 ![img](image/07201223-3c6c9863900644019ff3f7121f81e0cd.png) 

**22. 选择语言，下一步。**

**![img](image/1553090-20210716181721678-2125868658.png)**

 **23. 选择输出路径，输入应用名称，下一步。**

注意：这个文件名就是发给别人的那个安装的exe了

 ![img](image/07201312-a04d51ed72654ed58212d379d029abec-1656650933387.png) 

**24. 下一步，完成，先不运行脚本文件。**

注意：到这一步一定不要点击ok 点击cancle  先不运行，需要修改脚本文件哦

 ![img](image/1878959-20220428115058896-1850785789.png) 

 把修改脚本中的jre路径

![img](image/1878959-20220518155108014-354006981.png)



加入exe的静态目录

![1656586100638](image/1656586100638.png)

exe4j中图标要写成./resource/logo.ico



安装程序汉化处理（自行选择是否汉化）

下载简体中文isl文件

链接：https://pan.baidu.com/s/1F2FIj14o9urni9cCkoEXmQ
提取码：knlg

将下载好的文件放入Inno安装目录的Languages目录下

![img](image/1878959-20220606154010616-441746640.png)

 再在脚本中将语言改为中文

```
Name: "chinese_simp"; MessagesFile: "compiler:Languages\ChineseSimplified.isl"
```

![img](image/1878959-20220606154128396-1261659117.png)

然后直接编译，会提示保存当前脚本，随便起个名字，下个还可以继续用

 ![img](image/1878959-20220428115325822-1279509209.png)

 ![img](image/1878959-20220428115331672-138602197.png)

 ![img](image/1878959-20220428115336479-1925819062.png)