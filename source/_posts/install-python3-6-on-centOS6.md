---
title: 在CentOS6上安装python3.6
date: 2018-11-13 21:22:43
tags:
- linux
- python
---

接了个外包, 一个简单的展示页面, 就用django直接撸完了.

等到部署的时候才发现, 登录到机器上一查发行版发现是CentOS 6.

本来我想的是直接打包一个docker镜像放上去, 设置一下volumes就行了. 结果查了一下发现最高支持到1.7.1, 连新版docker都安不上, 本来想退而求其次安装一下docker旧版吧, 结果安装完了没法运行. 只能再退而求其次, 直接安装一个python3.6吧.

<!-- more -->

```bash
cd /usr/local/src/
wget https://www.python.org/ftp/python/3.6.7/Python-3.6.7.tar.xz
tar xf Python-3.6.7.tar.xz
cd Python-3.6.7.tar.xz
```

直接编译安装运行后又报了两个错误

一是`ModuleNotFoundError: No module named '_sqlite3'`, 原因是没有安装`sqlite-devel`, python在安装的时候没有编译对应的`_sqlite3.so`.

另一个错误是`django.db.utils.NotSupportedError: URIs not supported`. 这是因为centos6的sqlite3实在是太旧了(可以通过`python -c 'import sqlite3;print(sqlite3.sqlite_version)'`查看, 需要高于3.7.7)...

所以需要从[sqlite.org/index.html](https://sqlite.org/index.html)下载比较新的版本并且解压. 然后修改python源码文件夹的`setup.py`文件中的`sqlite_inc_paths`, 把解压后的sqlite3源码的路径放进来.

![1](https://ws1.sinaimg.cn/large/bd69bf14ly1fx6sgufy8mj20lh0dywfh.jpg)

做完这两步后就可以进行编译安装了

```bash
./configure && make -j4 && make install
```
