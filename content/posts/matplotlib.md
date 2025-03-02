---
title: ubuntu安装matplotlib
updated: 2016-07-25 19:26:07
date: 2016-07-25 19:26:07
tags:
  - python
---

(可恶,git 用的不熟练,把 commit 丢了...重写文章)

总结一下,在安装了`NumPy`之后还需要安装

1. freetype
2. libpng
3. libffi
4. cairocffi

<!-- more -->

freetype 下载地址 [http://download.savannah.gnu.org/releases/freetype/](http://download.savannah.gnu.org/releases/freetype/)

```bash
wget http://download.savannah.gnu.org/releases/freetype/freetype-2.6.5.tar.gz
tar xvf freetype-2.6.5
sudo make
sudo make install
```

libpng 和 libffi 都在 apt 上有

```bash
➜  artic git:(master) ✗ search libffi
libffi-dev - Foreign Function Interface library (development files)
```

```bash
➜  artic git:(master) ✗ search libpng
libpng12-0 - PNG library - runtime
libpng12-dev - PNG library - development
```

直接 apt-get 安装即可

调用`matplotlib`的时候图像式全黑的,提示我安装`cairocffi`,是 pip 上的包,安装了第三个之后直接`pip`安装这个就可以了.
