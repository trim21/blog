---
updated: 2016-04-16 01:03:39
title: 利用hexo和GitHub pages服务搭建博客
date: 2016-04-16 01:03:39
categories:
- 编程
tags:
- git
- nodejs
- gitHub
---

## GitHub Pages介绍

本博客就是用的[hexo](https://hexo.io/zh-cn/) 生成并自动部署的。主题是[landscape-plus](https://github.com/xiangming/landscape-plus) 我实际用的时候根据自己的情况做了一些修改.

主要参照的是V2ex上的[Hexo 部署 Github， Coding 进行国内外分流最全教程](https://www.v2ex.com/t/264283)
刚刚上去看了看,发现楼主域名挂了,所以文章也都挂了..

ps:coding现在会在pages服务中插广告了,不推荐使用.但是如果你能忍受的话要比GitHub Pages速度快一些.

GitHub Pages其实就是在GitHub的repo里面放好你整个博客网站的静态文件.首先使用hexo把markdown渲染成静态文件(html,css,js),.添加到某个repo中,然后push到GitHub上,这样一来,整个repo里面就有了你博客所有的静态文件,GitHub在你访问特定的域名的时候把相应的静态文件发回来,你就可以访问你的播客了.(所以如果要放其他的网站也是可以的,不一定非要用做博客,比如托管项目文档之类的.)

<!-- more -->

## 安装git

git是一个代码管理工具,官网是[https://git-scm.com/](https://git-scm.com/) 如果你已经科学上网了就直接下载好了,因为git的安装包是放在AWS上面的,所以有很大概率下载不下来.
可以用阿里云的镜像,找到版本号最大的那个直接安装就好了.[https://npm.taobao.org/mirrors/git-for-windows/](https://npm.taobao.org/mirrors/git-for-windows/)

安装过程中也是一路下一步.

安装完后在你的开始菜单中找到git bash,下面的操作都要在这个黑框框中进行了.

## hexo安装

### linux用户

需要`node`和`npm`,比较方便的办法是安装包管理器自带的nodejs和npm,再用npm安装`n`,然后用`n`安装最新版的node.

```bash
sudo apt-get install nodejs npm -y
sudo npm install n -g
sudo n latest
```

### windows

下载地址[https://nodejs.org/](https://nodejs.org/)

LTS或者是Latest都可以,用来渲染博客的话区别不大.

安装过程中一路next，然后在console中输入

```bash
node -v
```

如果安装成功了，会输出现在安装的node的版本。

然后安装hexo

```bash
npm install hexo -g
```

然后在你想要放博客文件的地方运行

```bash
hexo init BLOG_DRI_NAME
```

在此会新建一个以`BLOG_DIR_NAME`为名的文件夹在文件夹中就是hexo需要的文件。
（本来想贴个tree，但是文件太多了，就不贴了。）

现在看一下效果

```bash
cd BLOG_DIR_NAME
hexo s
```

可以看到控制台输出了

```log
INFO  Start processing
INFO  Hexo is running at http://localhost:4000/. Press Ctrl+C to stop.
```

现在访问`http://localhost:4000/`就可以看到效果了.

![default theme](https://ws3.sinaimg.cn/large/bd69bf14jw1f3zjixa0x5j21fm0sbaf3.jpg)

这是默认主题，而且现在只有一篇文章。打开`source/_posts`就可以看到。
再次新建`.md`文件，就会被渲染成文章。

### 安装新主题

直接用最流行的[NexT](https://github.com/iissnan/hexo-theme-next)举例吧.

```bash
git clone https://github.com/iissnan/hexo-theme-next themes/next
```

然后编辑`_config.yml`,或者`_config.yaml`,找到其中theme的这一行,修改成我们想用的next

```yaml
 ## Themes: https://hexo.io/themes/
theme: next
```

注意在`:`之后一定要有一个空格，才能被正确识别。

之后重新`hexo s`就能看到新的主题了.

## 自动部署

现在这样博客只有自己能看到,想要让别人也能看到就需要GitHub Pages服务了.
首先需要注册一个GitHub账号.
[https://github.com/](https://github.com/)

### 新建GitHub仓库

直接新建一个repo，名称要叫做`your_username.github.io`

### 添加GitHub密钥

在bash中运行

```bash
ssh-keygen -t rsa -C "you@youremail.com"
```

然后直接一路回车就好了。看到一个这样子的东西，说明生成成功了。

```plain
The key's randomart image is:
+---[RSA 2048]----+
|  .o=XB=         |
|   .+=B.         |
|   ..+* .        |
|    o+++         |
|     +..S        |
|   .  .o..       |
|    = +=+        |
|     O+B.=       |
|     .E++.=      |
+----[SHA256]-----+
```

在GitHub上的个人帐号设置里添加一个sshkey，把生成的id_sra.pub的文件内容复制过去就可以了。

### 设置自动部署

配置播客文件夹下的`_config.yml`

```yml
title: 网站标题
subtitle: 副标题
description: 描述
author: 作者
language: default
email:
timezone: Asia/Hong_Kong

# Category & Tag
default_category: uncategorized
category_map:
tag_map:

...

# Extensions
## Plugins: https://hexo.io/plugins/
## Themes: https://hexo.io/themes/
theme: NexT

# Deployment
## Docs: https://hexo.io/docs/deployment.html
deploy:
  type: git
  repository: 你的repo地址
  branch: master
```

可以设置首页上现实标签，分类和所有文章，但是这个怎么设置我忘记了= =||

主题在`# Extensions`里的`theme`中设置

需要设置的是`# Deployment`

需要安装插件

```bash
npm install hexo-deployer-git --save
```

安装成功之后运行

```bash
hexo clean
hexo g
hexo deploy
hexo clean
```

`hexo clean`清除目前已经生成的静态文件。
`hexo g`是`hexo generate`的缩写，根据md渲染生成静态网页
`hexo deploy`发布到GitHub。

或者你可以直接同时生成和发布

```bash
hexo g -d
```

或者

```bash
hexo d -g
```

如果发布成功了,会显示git仓库已经提交.也可以去GitHub的相应仓库看看里面的文件有没有更新.

输出说明deploy已经成功了，此时访问`your_username.github.io`就可以看到你的博客了。
