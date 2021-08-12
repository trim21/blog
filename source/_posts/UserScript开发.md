---
title: 提高userscript开发效率的一些工具
date: 2018-06-28 04:29:21
updated: 2018-10-07
categories:
  - 编程
tags:
  - javascript
---

这已经是旧文了, 见{% post_link webpack-userscript 使用webpack打包userscript %}

最一开始写 userscript 的时候是在编辑器里修改后复制粘贴到`Tampermonkey`中,后来觉得实在是太麻烦了,就搜了一下 Github 有没有什么现成的模板可以用.

<!-- more -->

发现了这个[turboteddy/userscript-grunt-template](https://github.com/turboteddy/userscript-grunt-template). 用了一下发现比原来效率高了不止一点. 就根据一些个人习惯稍微改了一下

因为我用的用户脚本扩展是`Tampermonkey`,所以下文中的`Tampermonkey`也包括了其他的同类插件.

我自己实际使用的代码在这里[Trim21/userscript-grunt-template](https://github.com/Trim21/userscript-grunt-template), 下面的内容以这个 repo 为准

## 最起码需要的几个功能

- 代码分块,不同类型的代码放在不同的文件中,比如要插入网页的 html 要放在`html`文件中,样式对应的代码放在`css`文件中,这样同时拥有了编辑器或者 IDE 的自动补全.
- LiveReload,即修改代码后自动刷新网页查看效果.

分成几部分来说

首先是代码分块, 这点用一个打包工具就可以做到了,比如我这里用到的是`Grunt`,因为`Grunt`有人已经写好了一个[grunt-userscript-meta](https://github.com/Zod-/grunt-userscript-meta),用来直接生成 userscript 开头的 meta 信息, 那么自动补全的问题也随之解决了.

### 开始

Grunt 的介绍我就不贴了 不了解的话也不会太影响使用 有兴趣的话可以看[阮一峰的 Grunt 介绍](https://javascript.ruanyifeng.com/tool/grunt.html)

```bash
git clone git@github.com:Trim21/userscript-grunt-template.git
cd userscript-grunt-template
npm i
npm run dev
```

更改`src/js/index.js`中的内容,grunt 就会重新打包生成`dist/latest`中 js 的内容

所有的原文件都在`src`文件夹中,`html`和`css`要在对应的文件夹里.

如果在 js 中想要引用对应的内容,要用到`/* @include ../html/page1.html */`这样的语法.(基于[`grunt-preprocess`](https://github.com/jsoverson/grunt-preprocess))

比如说要使用`GM_addStyle`,但是字符串又太长, 就可以把对应的样式放在`css/page1.css`,然后在 js 中这样写

```javascript
GM_addStyle("/* @include ../css/page1.css */");
```

`css/page1.css`

```css
#my-userscript-wrap {
  background-color: red;
}
```

最终会被打包成

```javascript
GM_addStyle("#my-userscript-wrap{background-color:red}");
```

虽然丧失了部分可读性,但我们也不修改打包后的文件对吧...

写代码的问题是解决了,还有让代码起效的问题. 总不能一次一次手动复制吧.

### 解决方法如下

首先,允许`Tampermonkey`扩展访问本地文件

右键扩展的图标, 选择管理扩展程序

![1](https://ws1.sinaimg.cn/large/bd69bf14ly1fsqd1me9o7j205a05fdfu.jpg)

在其中找到`允许访问文件网址`(也就是以`file://` 开头的 url)

![2](https://ws1.sinaimg.cn/large/bd69bf14ly1fsqd0vt6d5j20je0kujt9.jpg)

首先说下`Tampermonkey`的行为,如果脚本`@require`的是一个本地文件,那么每次加载的脚本的时候都会加载最新的本地文件. 如果`@require`的是`http`或者`https`协议的文件,那`Tampermonkey`会在第一次运行之后把文件内容缓存, 如果缓存存在, 就算文件内容更改了, 也不会更新.(但是可以手动更新). 所以不能直接通过`file`协议安装打包后的脚本,因为这样会导致重新打包后生效的还是旧代码. 需要通过`@require`这个 meta 来解决这个问题.

所要新建一个脚本,保持各种`meta`信息与你实际使用的用户脚本的`meta`相同,然后在最后一行加上这样的一行

```javascript
// @require      file:///path/to/your/userscript.user.js
```

把路径改成对应的`dist/latest/filename.user.js`即可.

这样,被 grunt 编译之后的脚本就能被`Tampermonkey`运行了.

而本体可以留空.

在之前运行了`npm run watch`命令,这个命令实际上是调用`grunt-contrib-watch`对应的代码,检测文件变化,运行相应的`Grunt`任务. 这个`Grunt`插件提供了一个`livereload`的服务端(默认端口号是 35729), 在这里, 使用[LiveReload 提供的插件](https://chrome.google.com/webstore/detail/jnihajbhpnppcggbcgedagnkighmdlei). 只要点一下右上角的扩展图标,在文件更改,在`Grunt`检测到文件变化,重新打包文件的时候, 就会通知插件, 刷新你点击图标时对应的选项卡.

这样,就把`js`和`html`,`css`给拆分开了, 修改`html`和`css`的时候也能享受编辑器提供的自动补全功能了, 而不用在`js`里修改字符串.
