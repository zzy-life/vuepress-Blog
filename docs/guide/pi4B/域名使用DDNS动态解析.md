# 域名使用DDNS动态解析

> 家里的电脑，没有固定公网 IP，IP随时可能更换，但是需要远程访问的场景

> 重要：必须先获取到公网IP才能使用本功能，需先下载安装Docker

## 动态域名解析的docker镜像

> 运行命令如下

```text
docker run -d --restart=always --net=host \
    -e "AKID=[ALIYUN's AccessKey-ID]" \
    -e "AKSCT=[ALIYUN's AccessKey-Secret]" \
    -e "DOMAIN=ddns.aliyun.win" \
    -e "REDO=30" \
    -e "TTL=60" \
    -e "TIMEZONE=8.0" \
    -e "TYPE=A,AAAA" \
    sanjusss/aliyun-ddns
```

| 环境变量名称 | 注释                                                         | 默认值            |
| ------------ | ------------------------------------------------------------ | ----------------- |
| AKID         | 阿里云的Access Key ID。[获取阿里云AccessToken](https://usercenter.console.aliyun.com/) | access key id     |
| AKSCT        | 阿里云的Access Key Secret。                                  | access key secret |
| DOMAIN       | 需要更新的域名，可以用“,”隔开。 可以指定线路，用“:”分隔线路和域名([线路名说明](https://help.aliyun.com/document_detail/29807.html?spm=a2c4g.11186623.2.14.42405eb4boCsnd))。 例如：“baidu.com,telecom:dianxin.baidu.com”。 | my.domain.com     |
| REDO         | 更新间隔，单位秒。建议大于等于TTL/2。                        | 300               |
| TTL          | 服务器缓存解析记录的时长，单位秒，普通用户最小为600。        | 600               |
| TIMEZONE     | 输出日志时的时区，单位小时。                                 | 8                 |
| TYPE         | 需要更改的记录类型，可以用“,”隔开，只能是“A”、“AAAA”或“A,AAAA”。 | A,AAAA            |
| CNIPV4       | 检查IPv4地址时，仅使用中国服务器。                           | false             |
| WEBHOOK      | WEBHOOK推送地址。                                            | 无                |
| CHECKLOCAL   | 是否检查本地网卡IP。此选项将禁用在线API的IP检查。 网络模式必须设置为host。 (Windows版docker无法读取本机IP) | false             |
| IPV4NETS     | 本地网卡的IPv4网段。格式示例：“192.168.1.0/24”。多个网段用“,”隔开。 | 无                |
| IPV6NETS     | 本地网卡的IPv6网段。格式示例：“240e::/16”。多个网段用“,”隔开。 | 无                |

[阿里云的参数案例可点击](https://help.aliyun.com/document_detail/141482.html) 

### 案例

```shell
docker run -d 
--restart=always 
--net=host     
-e "AKID=KeyID"     
-e "AKSCT=KeySCT"     
-e "DOMAIN=www.zhangzhiyu.live,zhangzhiyu.live,api.zhangzhiyu.live"     
-e "REDO=30"     
-e "TTL=600"     
-e "TIMEZONE=8.0"     
-e "TYPE=A,AAAA"     
sanjusss/aliyun-ddns
```



## 非阿里云购买的域名

> [不是阿里云购买的域名请点击](https://help.aliyun.com/knowledge_detail/39793.html)


