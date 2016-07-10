title: 配置一下ubuntu上的hexo环境，从win迁移过来都发布不了了
date: 2016-07-10 11:20:38
categories:
- 编程
tags:
- Linux
- Node
- JavaScript
- Hexo
---
# ubuntu下hexo的配置，主要是从win迁移过来
今天进行了从win到linux的迁移，现在这篇博客是在ubuntu 16.04LTS下写的。仍然用的是vscode，现在还什么插件都没有装。
上次提交的markdown下面snippet不能使用的issue已经被修复了，现在直接输入`link`会用自动补全了。之前一直用的是autohotkey，现在也用不到了。
其实fcitx挺好用的，完全感觉完全没有必要再去装个搜狗了。preview中汉字过小的问题也懒得去解决了，反正也不打算用这个来预览了

<!-- more -->
## 环境
ubuntu 16.04LTS node v6.3.0 npm v3.10.3
## 现在遇到的主要问题
1. 无法生成静态文件
现在生成会报
```bashub
INFO  Start processing
INFO  Files loaded in 293 ms
WARN  No layout: categories/index.html
WARN  No layout: tags/index.html
WARN  No layout: 2016/05/一个可以控制并发的小爬虫/index.html
WARN  No layout: 2016/05/之前写的一个小东西/index.html
WARN  No layout: 2016/04/vscode+node开发环境配置/index.html
WARN  No layout: 2016/04/hexo+github.io搭建博客/index.html
WARN  No layout: 2016/04/hack/index.html
WARN  No layout: 2016/04/nodejs/index.html
WARN  No layout: archives/index.html
WARN  No layout: archives/2016/index.html
WARN  No layout: archives/2016/04/index.html
WARN  No layout: archives/2016/05/index.html
WARN  No layout: categories/编程/index.html
WARN  No layout: index.html
WARN  No layout: tags/JavaScript/index.html
WARN  No layout: tags/http/index.html
WARN  No layout: tags/Node/index.html
WARN  No layout: tags/git/index.html
WARN  No layout: tags/GitHub/index.html
WARN  No layout: tags/node/index.html
WARN  No layout: tags/Visual-Studio-Code/index.html
WARN  No layout: tags/Async/index.html
WARN  No layout: tags/Linux/index.html
```
=。=感觉有点迷，
实际看了一下，因为之前的next目录用的是git的submodule，所以pull的时候怎么也pull不下来，（其实是我没有使用正确的姿势pull）
重新clone了主题就好了

所以可以看出，hexo的跨平台性还是挺好的，只要ssh密钥需要重新绑定，整个blog文件夹都不需要动。

打算把这套东西部署到vps上面去，到时候只需要维护本地的source文件夹，其他的东西都交给vps来办，毕竟没有放在本地的必要。

目前的想法，在本地维护一个git repo，然后使用github的webhook给虚拟机虚拟机发信号，虚拟机只需要运行提前写好的shell脚本就可以了。

本地git repo -> GitHub --webhook--> VPS --hexo d--> GitHub pages