title: 尴尬了,上不去GitHub了
date: 2016-07-12 11:01:00
categories: 
- 编程
tags:
- Linux
---

# 尴尬了,上不去GitHub了

现在网络环境是用树莓派和 hostapd 当路由器,笔记本是 ubuntu 16.04 +chrome stable.
GitHub 能解析,能 ping 通,但是无法连接.
之前改过一次 hosts,以为是 hosts 的原因,把 hosts 中 GitHub 的部分都删掉了,
同时清理了 chrome 的 dns 缓存.
在树莓派上试了一下可以 wget 到相应的网页,但是在笔记本上死活就链接不到.删掉了用 chrome 会报 ERR_CONNECTION_REFUSED,用 firefox 也无法连接
chrome 现在没用 cookies

<!-- more -->

![](http://ww2.sinaimg.cn/large/bd69bf14jw1f5qvbcuikmj20o30n1dpv.jpg)
之前通过 ssh 还 clone 过好几个项目,.ssh 文件夹下有相应的 ssh 密钥,现在

```bash
$ ssh -T git@github.com
ssh: connect to host github.com port 22: Connection refused
```

本来以为是路由器出了问题.现在换了学校的wifi,仍然无法链接,发现问题出在本机上了.

那么问题到底出在哪呢= =
现在翻墙靠的是hosts+强制https,所以上网找了一份hosts,但是这份hosts里面的github的ip太旧了,所以一直连不上.

`sudo vim /etc/hosts`把相应的github部分的删掉就好了.