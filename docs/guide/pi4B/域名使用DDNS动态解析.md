# 域名使用DDNS动态解析

> 家里的电脑，没有固定公网 IP，IP随时可能更换，但是需要远程访问的场景

> 重要：必须先获取到公网IP才能使用本功能，需先下载安装Docker

## 动态域名解析的[docker镜像](https://github.com/NewFuture/DDNS)



> 运行命令如下

```shell
docker run -d  --restart=always --net=host  -v /db/DDNS/config.json:/config.json   newfuture/ddns
```



在/path/to目录下新建config.json

```json
{
  "$schema": "https://ddns.newfuture.cc/schema/v2.8.json",
  "id": "账号id",
  "token": "账号密钥",
  "dns": "alidns",
  "ipv4": ["api.zhangzhiyu.live", "zhangzhiyu.live","www.zhangzhiyu.live"],
  "index4": "public",
  "index6": "public",
  "ttl": 600,
  "proxy": "127.0.0.1:1080;DIRECT",
  "debug": false
}
```



| key    | type               | required | default     | description       | tips                                                         |
| ------ | ------------------ | -------- | ----------- | ----------------- | ------------------------------------------------------------ |
| id     | string             | √        | 无          | api 访问 ID       | Access Key ID                                                |
| token  | string             | √        | 无          | api 授权 token    | 部分平台叫 secret key , **反馈粘贴时删除**                   |
| dns    | string             | No       | `"dnspod"`  | dns 服务商        | 阿里 DNS 为`alidns`, Cloudflare 为 `cloudflare`, dns.com 为 `dnscom`, DNSPOD 国内为 `dnspod`, DNSPOD 国际版为 `dnspod_com`, HE.net 为`he`, 华为 DNS 为`huaweidns`, 自定义回调为`callback` |
| ipv4   | array              | No       | `[]`        | ipv4 域名列表     | 为`[]`时,不会获取和更新 IPv4 地址                            |
| ipv6   | array              | No       | `[]`        | ipv6 域名列表     | 为`[]`时,不会获取和更新 IPv6 地址                            |
| index4 | string\|int\|array | No       | `"default"` | ipv4 获取方式     | 可设置`网卡`,`内网`,`公网`,`正则`等方式                      |
| index6 | string\|int\|array | No       | `"default"` | ipv6 获取方式     | 可设置`网卡`,`内网`,`公网`,`正则`等方式                      |
| ttl    | number             | No       | `null`      | DNS 解析 TTL 时间 | 不设置采用 DNS 默认策略                                      |
| proxy  | string             | No       | 无          | http 代理`;`分割  | 多代理逐个尝试直到成功,`DIRECT`为直连                        |
| debug  | bool               | No       | `false`     | 是否开启调试      | 运行异常时,打开调试输出,方便诊断错误                         |
| cache  | string\|bool       | No       | `true`      | 是否缓存记录      | 正常情况打开避免频繁更新,默认位置为临时目录下`ddns.cache`, 也可以指定一个具体文件实现自定义文件缓存位置 |




### 快速配置

1. 申请 api `token`,填写到对应的`id`和`token`字段:

   - [DNSPOD(国内版)创建 token](https://support.dnspod.cn/Kb/showarticle/tsid/227/)
   - [阿里云 accesskey](https://help.aliyun.com/document_detail/87745.htm)
   - [DNS.COM API Key/Secret](https://www.dns.com/member/apiSet)
   - [DNSPOD(国际版)](https://www.dnspod.com/docs/info.html#get-the-user-token)
   - [CloudFlare API Key](https://support.cloudflare.com/hc/en-us/articles/200167836-Where-do-I-find-my-Cloudflare-API-key-) (除了`email + API KEY`,也可使用`Token`需要列出 Zone 权限)
   - [HE.net DDNS 文档](https://dns.he.net/docs.html)（仅需将设置的密码填入`token`字段，`id`字段可留空）
   - [华为 APIKEY 申请](https://console.huaweicloud.com/iam/)（点左边访问密钥，然后点新增访问密钥）
   - 自定义回调的参数填写方式请查看下方的自定义回调配置说明

2. 修改配置文件,`ipv4`和`ipv6`字段，为待更新的域名,详细参照配置说明

#### index4 和 index6 参数说明

- 数字(`0`,`1`,`2`,`3`等): 第 i 个网卡 ip
- 字符串`"default"`(或者无此项): 系统访问外网默认 IP
- 字符串`"public"`: 使用公网 ip(使用公网 API 查询,url 的简化模式)
- 字符串`"url:xxx"`: 打开 URL `xxx`(如:`"url:http://ip.sb"`),从返回的数据提取 IP 地址
- 字符串`"regex:xxx"` 正则表达(如`"regex:192.*"`): 提取`ifconfig`/`ipconfig`中与之匹配的首个 IP 地址,**注意 json 转义**(`\`要写成`\\`)
  - `"192.*"`表示 192 开头的所有 ip
  - 如果想匹配`10.00.xxxx`应该写成`"regex:10\\.00\\..\*"`(`"\\"`json 转义成`\`)
- 字符串`"cmd:xxxx"`: 执行命令`xxxx`的 stdout 输出结果作为目标 IP
- 字符串`"shell:xxx"`: 使用系统 shell 运行`xxx`,并把结果 stdout 作为目标 IP
- `false`: 强制禁止更新 ipv4 或 ipv6 的 DNS 解析
- 列表：依次执行列表中的index规则，并将最先获得的结果作为目标 IP
  - 例如`["public", "172.*"]`将先查询公网API，未获取到IP后再从本地寻找172开头的IP
  - 

[阿里云的参数案例可点击](https://help.aliyun.com/document_detail/141482.html) 

### 案例


```json
{
  "$schema": "https://ddns.newfuture.cc/schema/v2.8.json",
  "id": "12345",
  "token": "mytokenkey",
  "dns": "dnspod 或 dnspod_com 或 alidns 或 dnscom 或 cloudflare 或 he 或 huaweidns 或 callback",
  "ipv4": ["ddns.newfuture.cc", "ipv4.ddns.newfuture.cc"],
  "ipv6": ["ddns.newfuture.cc", "ipv6.ddns.newfuture.cc"],
  "index4": "public",
  "index6": "public",
  "ttl": 600,
  "proxy": "127.0.0.1:1080;DIRECT",
  "debug": false
}
```



在·
