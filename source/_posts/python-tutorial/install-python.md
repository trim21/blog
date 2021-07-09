---
title: python和相关软件的安装
date: 2019-10-10 22:24:43
categories:
  - 编程
  - 教程
  - python
tags:
  - python
---

好久没写文章了，最近也没学什么新的适合用来写文章的技术。
想了想，自己当初的自学的 python（当初好像才出 python3.4，现在马上 3.8 都要出了），就写写 python 的教程吧。
虽然现在教程其实遍地都是。比如各种培训机构，或者其他像我一样的爱好者，形式也有公众号，有视频。
不过自己写出来的教程还是有很多自己的感悟，和当初走过的弯路，也包括了很多编程相关的计算机知识。

这篇文章介绍在什么都没有的电脑上安装完所有需要的软件，并且尝试运行我们的第一个 python 程序。

<!-- more -->

## 我的环境

我使用的 win10 64 位家庭版 （关于 64 位或者 32 位可以在`设置-关于`中查看）

<details>
<summary>关于位数</summary>

操作系统和应用程序都分为`32位`或`64位`，64 位的操作系统运行 32 位的应用程序，但是反之不可，即 32 位的操作系统不可以运行 64 位的应用程序。

</details>

写出来的一份 python 代码既可以使用 32 位的 python 程序来运行，也可以使用 64 位的 python 来运行。如果你是 32 位的计算机，所以不需要无法运行文章中的代码。即，大多数情况下 python 代码是没有位数只分的（起码本文不会涉及）。

![image](https://tvax1.sinaimg.cn/large/bd69bf14ly1g7thepvmsmj20uz0s10v1.jpg)

## 背景知识

<details>
<summary>关于为什么学习和安装python3即可</summary>

python 的版本现在是分裂的，主要分为 python2 和 python3 两个版本。

因为 python 的开发开始于 1990 年，但是编程的发展和计算机的性能非常的快，所以在某一个时间点，python 的开发人员决定抛弃历史包袱，重新设计一些比较底层的东西。造成了 python 语法的不兼容。

而 python2 就是那个旧的版本，在 2020 年，python 开发组将会正式的放弃对 python2 的一切维护（具体时间可以在 [这个网站](https://pythonclock.org/) 看到)，只维护 python3。并且在 python3 发布了这么久之后，大部分的包已经兼容了 python3，所以现在没有任何理由去使用 python2。

</details>

大部分用到的网站或者工具只有英语，所以请做好心理准备。
但是因为相关网站都是编程相关的，所以实际会用到的单词并不是很多。

## 下载安装

下载地址：<https://www.python.org/downloads/windows/>

![image](https://tvax1.sinaimg.cn/large/bd69bf14ly1g7thvda5o9j21ge0tzak0.jpg)

（在你看到这篇文章的时候应该是 3.8，但 3.7 与 3.8 的语法没有什么区别，所以文本使用的是 3.7）

选择`Latest Python 3 Release`，之后会转跳到具体版本的页面，拉到页面下方的`Files`部分

![image](https://tvax2.sinaimg.cn/large/bd69bf14ly1g7thxx6wxuj21ge0tz150.jpg)

根据你的计算机版本选择

`Windows x86-64 executable installer`（64 位）

`Windows x86 executable installer`（32 位）

在 windows 下的安装中要注意的地方仅有一个：**一定要选中一个`add python to PATH`的选项**（或者是`Add python to environment variables`），其他的地方一路下一步就可。

## 尝试运行

到目前为止，如果一路顺利的话已经可以正常使用 python 了，我们来验证一下。

打开一个`命令提示符`，就是电视剧或者电影中常见的那种黑客用的噼里啪啦打字的命令行界面。

方法：

按下`win+R`，在弹出的运行框中输入`powershell`，会弹出一个蓝底白字，长成这个样子的框框：

![powershell](https://tvax3.sinaimg.cn/large/bd69bf14ly1g7tiai1giij20nv0b5t8v.jpg)

这个就是大家常说的`命令行`，`终端`，`敲命令`。

验证 python 是否安装成功的办法就是运行这么一条命令

```bash
python --version
```

如果一切正常，会输出当前成功安装的 python 版本号。

如果输出`python: 无法将“python”项识别为 cmdlet、函数、脚本文件或可运行程序的名称。请检查名称的拼写，如果包括路径，请确保路径正确，然后再试一次。`

有两种可能：

1. 你没等前一步完成就心急的打开了命令行，现在等 python 安装完成后，重新进行`尝试运行`这一步。
2. 你耐心等待 python 安装完成后才打开了命令行，说明你在安装过程中忘记点上`Add python to PATH`或者`Add python to environment variables`，现在关闭终端，重新打开安装包，选择`Modify`选项，勾选对应选项，然后再次安装，再重复`常识运行`这一步骤。

## 开始写我们的第一个 python 程序

### 安装一个 ide 或者编辑器

如果你之前试图写过程序，可能你的计算机上已经安装了比如`notepad++`，`Atom`，`sublime`或者`vscode`等任何一种编辑器。

因为现在 vscode 基本快一统天下了（使用率已经超过了 50%），所以本文会使用 vscode

<details>
<summary>VSCode跟那个 VS(Visual Studio)的区别 </summary>

vscode 全称是`visual studio code`，跟`visual studio`同样是微软的产品，但其实两个软件除了配色比较类似以外，并没有什么关联。

`visual studio code`（或者简称 vsc，vscode）是一个编辑器，打开速度比较快，安装需要的硬盘空间比较少，功能相应比较少。

`visual studio`这样的 IDE（集成开发环境），编辑是他最基本的功能，除了编辑代码文件以外还包括了编译器，和对应语言的一些源代码，同时还提供了编译，调试等功能，安装需要的硬盘空间大（动辄几 G，而 vscode 只需要几十或者几百 MB）。

但是——vs 的大部分功能我们都用不到，而且 vs 对 python 的支持也说不上有多么好，完全没有安装的必要，所以安装 vscode 即可。

</details>

<details>
<summary>如果你想使用功能比较全面的ide，而不想用vscode</summary>

推荐你使用[pycharm](https://www.jetbrains.com/pycharm/download/)，如果你可以使用教育邮箱，可以用教育邮箱去申请免费的 pro 版本；如果没有，可以使用 community 版本即社区版。pro 版本有但是社区版有的功能都是 web 开发或者科学计算相关的功能。

优点：功能丰富，有强大的自动补全功能。调试，运行代码方便。
缺点：打开速度慢，占用资源多，安装需要的硬盘空间大，**没有中文**。

其他的 IDE 不要尝试下载，甚至都不如 vscode 好用。

</details>

vscode 的安装地址：<https://code.visualstudio.com/> 一路下一步就可，没有什么需要注意的地方。

安装完成后即可在开始菜单中看到 vscode 的图标。

#### 但我们不是这么启动 vscode，我们要用另一种方式启动它

在桌面上创建一个新的文件夹，名称为`mycode`

然后打开文件夹，右键空白的地方，可以看到右键菜单中多了一项`Open with Code`，还带着我们刚刚的安装的 vscode 的图标，点击，就可以启动 vscode 了。

![open with code](https://tvax4.sinaimg.cn/large/bd69bf14ly1g7tl7pqxfhj20oy0htjt9.jpg)

#### 安装插件

vscode 本体比较小，是因为有部分功能是通过插件提供的，这样用户可以不安装用不到的功能。

我们一共要安装两个插件

##### 首先要安装中文语言包

![image](https://tvax2.sinaimg.cn/large/bd69bf14ly1g7tlcdyuvpj20pt0j0dhj.jpg)

分别点击`1`对应的`插件`图标，在`2`对应得搜索框中搜索`chinese`，然后点击第一个搜索结果右下角的`Install`，等待进度条转完，可以看到右下角会弹出一个通知，提示你要重启才能启动这个插件，直接重启即可。

##### 然后是安装 python 插件

跟上一步一样，不过这个时候要搜索的内容变成了`python`，同样安装第一个插件。

到现在为止，所有需要的东西都已经安装完成了，我们要开始尝试运行我们的第一个程序了。

## 开始编写第一个程序

<details>
<summary>选择资源管理器界面</summary>

![image](https://tvax1.sinaimg.cn/large/bd69bf14ly1g7tlkqyid2j20al091wf6.jpg)

</details>

点击图标，创建一个`main.py`文件。

![image](https://tva1.sinaimg.cn/large/bd69bf14ly1g7tlpgebjvj20eq08iwes.jpg)

输入`print('hello world')`（注意，所有的标点符号全是半角符号，建议切换到英文输入法），然后按`Ctrl+S`保存。

在这个过程中，你可能已经体会到了自动补全功能的好。

![image](https://tvax2.sinaimg.cn/large/bd69bf14ly1g7tlzug7gxj20ff05xjrl.jpg)

只需要输入`pr`，再按下`Tab`键（在 q 的左边），编辑器就可以自动帮你输入完成 print 这个函数名。

## 运行我们的 python 程序

现在，我们的第一个 python 程序就算编写完了，只有一行代码。接下来我们就要运行这个程序。

python 是一种解释型语言，通俗地讲，就是我们要用 python 的`解释器`来运行“python 的源代码”。

还记得之前我们提过的命令行吗，我们现在要再打开一个命令行，但是是从不一样的地方打开：

![image](https://tva2.sinaimg.cn/large/bd69bf14ly1g7tm5s6v4dj20g60a2jsc.jpg)

在我们之前打开的文件夹的左上角，有一个`文件`菜单，选择`打开windows powershell`（或者快捷键`Alt+F`，在按下`R`)

又看到了这个熟悉的蓝白框框，我们这次仍然是使用 python 命令

```bash
python main.py
```

这个命令的含义是使用 python 的解释器来运行我们的 python 程序`main.py`

![image](https://tva2.sinaimg.cn/large/bd69bf14ly1g7tmbo2bf5j20ep02xq2t.jpg)

如果的确输出了 hello world，说明我们的程序成功被运行了，电脑上的 python 可以正常工作。
