---
updated: 2018-10-07
title: 使用webpack打包userscript
date: 2018-10-03 11:15:35
categories:
- 编程
tags:
- javascript
---

原本用的是grunt来打包webpack, 但是grunt只是依赖于简单的字符串替换和拼接, 效率过低.

既然webpack可以用来打包别的js文件, 那么打包一个userscript肯定也没什么问题, 甚至大材小用了.

所以自己写了一个模板[webpack-userscript-template](https://github.com/Trim21/webpack-userscript-template)

<!-- more -->

因为找了一下, 发现相应的工具还是有些缺陷的.

主要有两个问题:

1. 生成userscript的meta注释
2. 没有一个好用的http client库.

所以为了自己写userscript爽一点, 写了两个库解决了这个问题.

[userscript-metadata-webpack-plugin](https://github.com/Trim21/userscript-metadata-webpack-plugin)用来解决生成meta的问题

[axios-userscript-adapter](https://github.com/Trim21/axios-userscript-adapter)是axios的一个adapter, 用来解决进行http请求的问题.

本来github上是有一个webpack-userscript项目的, 但是里面不知道为什么, 打包用到的是bash, 理解不了...就自己写了一个[webpack-userscript-template](https://github.com/Trim21/webpack-userscript-template)

使用axios的时候不要忘了加入connect的meta
