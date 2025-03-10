---
date: "2018-10-03T11:15:35+08:00"
tags:
  - javascript
title: 使用webpack打包userscript
type: post
---

原本用的是 grunt 来打包 webpack, 但是 grunt 只是依赖于简单的字符串替换和拼接, 效率过低.

既然 webpack 可以用来打包别的 js 文件, 那么打包一个 userscript 肯定也没什么问题, 甚至大材小用了.

所以自己写了一个模板[webpack-userscript-template](https://github.com/Trim21/webpack-userscript-template)

<!-- more -->

因为找了一下, 发现相应的工具还是有些缺陷的.

主要有两个问题:

1. 生成 userscript 的 meta 注释
2. 没有一个好用的 http client 库.

所以为了自己写 userscript 爽一点, 写了两个库解决了这个问题.

[userscript-metadata-webpack-plugin](https://github.com/Trim21/userscript-metadata-webpack-plugin)用来解决生成 meta 的问题

[axios-userscript-adapter](https://github.com/Trim21/axios-userscript-adapter)是 axios 的一个 adapter, 用来解决进行 http 请求的问题.

本来 github 上是有一个 webpack-userscript 项目的, 但是里面不知道为什么, 打包用到的是 bash, 理解不了...就自己写了一个[webpack-userscript-template](https://github.com/Trim21/webpack-userscript-template)

使用 axios 的时候不要忘了加入 connect 的 meta
