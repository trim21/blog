title: hexo+github.io搭建博客
date: 2016-04-16 01:03:39
categories:
- 编程
tags:
- git
- Node
- GitHub
---
# hexo+github.io搭建博客

## hexo安装
本博客就是用的[hexo](https://hexo.io/zh-cn/)生成并自动部署的。主题是[NexT](https://github.com/iissnan/hexo-theme-next)

主要参照的是V2ex上的[Hexo 部署 Github， Coding 进行国内外分流最全教程](https://www.v2ex.com/t/264283)

<!-- more -->

需要安装`node`和`npm`,(安装`node`的时候很少会有人不安装`npm`)..

下载地址[https://nodejs.org/](https://nodejs.org/)

安装之后一路next,然后在console中输入
```
$ node -v
```

如果安装成功了,会输出现在安装的node的版本.

然后安装hexo

```
$ npm install hexo -g
```

然后在你想要放博客文件的地方运行

```
$ hexo init BLOG_NAME
```
在此会新建一个以`BLOG_NAME`为名的文件夹在文件夹中就是hexo需要的文件。
（本来想贴个tree，但是文件太多了，就不贴了。）

现在看一下效果

```
$ cd BLOG_NAME
$ hexo s
```

可以看到控制台输出了
```
INFO  Start processing
INFO  Hexo is running at http://localhost:4000/. Press Ctrl+C to stop.
```

现在访问`http://localhost:4000/`就可以看到效果了.
![](http://ww3.sinaimg.cn/large/bd69bf14jw1f3zjixa0x5j21fm0sbaf3.jpg)
这是默认主题,而且现在只有一篇文章.打开` source/_posts`就可以看到.
再次新建`.md`文件,就会被渲染成文章.

## 自动部署

### 新建GitHub仓库
直接新建一个repo,名称要叫做`username.github.io`


### 添加GitHub密钥
下面需要有一个GitHub账号.我用的是windows,所以需要安装`Git for windows`.(其实上面也是在Git bash里面运行的).

在bash中运行
```
$ ssh-keygen -t rsa -C "you@youremail.com"
```
然后直接一路回车就好了.看到一个这样子的东西,说明生成成功了.
```
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

在github上的个人帐号设置里添加一个sshkey,把生成的id_sra.pub的文件内容复制过去就可以了.


### 设置自动部署

配置播客文件夹下的`_config.xml`

```xml
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

可以设置首页上现实标签,分类和所有文章,但是这个怎么设置我忘记了= =||

主题在`# Extensions`里的`theme`中设置

需要设置的是`# Deployment`

需要安装插件

```
$ npm install hexo-deployer-git --save
```
安装成功之后运行
```
$ hexo clean && hexo g && hexo deploy && hexo clean
```
`hexo clean`清除目前已经生成的静态文件.
`hexo g`是`hexo generate`的缩写,根据md渲染生成静态网页
`hexo deploy`发布到github.
```

Branch master set up to track remote branch master from git@github.com:Trim21/trim21.github.io.git.
To git@github.com:Trim21/trim21.github.io.git
   fbe8fdf..0efa36b  HEAD -> master
INFO  Deploy done: git

```

输出说明deploy已经成功了,此事访问`username.github.io`就可以看到你的博客了.

当然,前面会输出一大堆的`LF`和`CRLF`替换之类的.不用管他们.只要访问网址没问题不就好了嘛=.=

xml格式文件有个坑,在`:`之后一定要有一个空格,才能被正确识别.

