# svn常见命令

> svn常见命令

## 编辑passwd文件，添加用户

建立svn用户以及密码：

```bash
[users]
aaa=aaa123
bbb=bbb123
ccc=ccc123
ddd=ddd123
```

 

## 编辑authz，配置用户组和权限

配置组：

```bash
[groups]
# harry_and_sally = harry,sally
# harry_sally_and_joe = harry,sally,&joe
 
# [/foo/bar]
# harry = rw
# &joe = r
# * =
 
# [repository:/baz/fuz]
# @harry_and_sally = rw
# * = r
总管理员 = admin
开发组 = qqq,www,eee,rrr
运维组 = ttt,yyy,uuu,iii
测试组 = aaa,bbb,ccc,ddd

```


配置各个组权限：

```bash

[/]                   #[/]表示是svn根目录，标签后的用户拥有根目录权限
@总管理员 = rw         #分配给总管理员用户组根目录的读写权限
@开发组 = rw           #分配给开发组用户组根目录的读写权限
*=                    #没有分配权限的用户没有读写权限
 
[/运维知识库]          #根目录下面有一个[运维知识库]文件夹，
@运维组 = rw           #分配给运维组用户组根目录的读写权限
zzz = rq              #分配读写权限给zzz用户，为单个用户分配权限
 
[/测试知识库]
@测试组 = rw
```

