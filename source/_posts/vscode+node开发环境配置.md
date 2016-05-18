title: vscode+node开发环境配置
date: 2016-04-16 02:09:00
categories:
- 编程
tags:
- Visual Studio Code
- npm
- Node
- JavaScript
---
不占坑了，开始写
# 入坑
初接触编程是在大一，之前一直觉得编程多么酷炫多么厉害，然后自己找了本c的书看啊看看啊看，看了不少基本概念。但是要我自己上手写，写写逻辑是可以，但是要真正写个有用的东西出来还是挺难的。光字符串是一个字符数组就直接让我放弃了。谁说话会想我要说多长的一句话啊- -
当时折腾vs2015 Community，安装了等没兴趣了就删掉了，又兴趣来了安装上了，来来回回的，然后后来就直接用gcc去了，不折腾vs了。
当时就知道vscode了，因为再怎么用IDE也是要有一个编辑器用的。 一开始用的是Notepad++，但是感觉其实挺难用的。。功能有点太多了，当时也不会什么，根本不知道有些功能是干什么用的，然后听说了vs出了个vscode。
所以放下了好长时间之后，其实就是解除了Node之后，又开始写了，折腾了一大堆，现在用的非常顺手了。

<!-- more -->

## 正文

下载和安装就不说了。推荐在选项里选上直接可以右键Open with Code，在工作目录里直接右键就可以打开vsc了。

我原来在html里直接写`<script>`标签的时候本来本来是有自动补全的，后来在某一个版本更新之后居然消失不见了。本来我也没想折腾的，这一次更新之后本来各种对象的方法我都记不住，你还不提示我了，我怎么玩？

所以就干脆折腾一下好了。

## 自动补全-Typings

  Typings直接用npm安装，
```bash
$ npm install typings -g
```
`-g`表示全局安装。安装后不依赖在目前的文件夹下。

先进入自己的工作目录
```
$ typings init
```
这条命令会在当前shell的工作目录下建立一个`typings.json`，其中写明了进行补全的npm模块。
```
$ typings install sqlite3 --ambient --save
```
此时在js文件中`require`了`express`模块之后，就可以进行补全了。

![](http://ww1.sinaimg.cn/large/bd69bf14jw1f2yie4gq93j20f3066gm5.jpg)

