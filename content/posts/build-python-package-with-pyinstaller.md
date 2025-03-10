---
date: "2019-06-02T23:47:34+08:00"
tags:
  - python
title: 用PyInstaller打包python应用
type: post
---

那天突然好奇，`docker-compose`是用什么语言写的。然后一看，发现居然是用 python2 写的。

但想到我安装的时候从来没在乎过机器上有没有安装 python，或者我的 python 版本是多少，而是按照官网的文档，直接下载一个二进制文件来安装的。突然眼前一亮。看了一下对应的构建代码，发现他是用[`PyInstaller`](https://github.com/pyinstaller/pyinstaller)来进行打包的，把一个 python 应用打包成单个的二进制文件。

一般来说，正常的 python 包的分发会基于 pip 的，发布到 pypi 和用户下载的都是代码文件（和其他语言编译的二进制文件），如果依赖于其他的 package 会在安装的时候再进行下载。

但用`PyInstaller`，打包出来的可执行文件中包含了所有用到的依赖和 python 解释器，并不需要本机安装了 python 或者 pip，像 docker-compose 这样的工具，打包之后成一个单文件，对于用户在安装和使用的时候都会方便许多，而对于我们开发者来说，就不用考虑兼容旧的 python 版本，可以直接使用 python3.6 的新语法如 type annotation 等，使用某些只有 python3.6 以上版本才能用的依赖库，自然也比原来爽了许多。

<!-- more -->

首先，PyInstaller 的工作原理是从一个 py 文件出发在静态分析出所有用到的依赖，然后把所有的依赖打包起来，在用户使用二进制的时候释放到一个临时文件夹中，用 Python 解释器来运行。

PyInstaller 入门的文章已经有很多了，就不再重复写一遍了，主要遇到的坑有这么几个。

## 用到的非 py 文件要手动指定路径一起打包

我的程序中用到了一些模板文件，是在程序运行起来之后才根据需要加载决定是否渲染的。这些文件因为不是 python 文件，所以 PyInstaller 在分析的时候也不会知道是程序的一部分，就不会打包在二进制中。

在程序运行的时候，如果用到了对应的文件，因为没有被打包进来的缘故，程序就会报错。

如果用命令行来指定要一起打包的文件效率过低，所以可以编写一个 spec 文件来告诉 PyInstaller 要如何打包。

（这是我之前尝试打包我的程序是用到的 spec 文件，但是因为不支持`entry_points`的原因，所以我最后放弃了使用这个办法，但是打包出来的程序在不用到`entry_points`的情况下是跟直接使用 pip 安装行为一致的。）

`bgmi.spec`

```python
# -*- mode: python -*-
from PyInstaller.building.api import EXE, PYZ
from PyInstaller.building.build_main import Analysis

import os
import os.path
import importlib

bindata_dir = [
    'bgmi/front/templates',
    'bgmi/lib/models/migrations',
]


def get_bindata():
    for dir_path in bindata_dir:
        for file in os.listdir(dir_path):
            yield (os.path.join(dir_path, file), dir_path)


block_cipher = None

package_imports = [['peewee_migrate', ['template.txt']]]
datas = list(get_bindata())

for package, files in package_imports:
    proot = os.path.dirname(importlib.import_module(package).__file__)
    datas.extend((os.path.join(proot, f), package) for f in files)

a = Analysis(['bgmi/__main__.py'],
             pathex=['.'],
             hiddenimports=[],
             hookspath=None,
             datas=datas,
             runtime_hooks=None,
             cipher=block_cipher)

pyz = PYZ(a.pure, cipher=block_cipher)

exe = EXE(
    pyz,
    a.scripts,
    a.binaries,
    a.zipfiles,
    a.datas,
    name='bgmi',
    debug=False,
    strip=None,
    upx=True,
    console=True,
    bootloader_ignore_signals=True,
)
```

其中，`a = Analysis(['bgmi/__main__.py'],`为程序的入口就是原本如果使用命令行的话，在 PyInstaller 后面跟的那个 py 文件路径。

而`get_bin_data`则是找到所有要打包进去的非 py 文件，告诉 PyInstaller 这些文件需要打包。`datas`的格式应该是一个`List[List]`。而内部的列表第一个元素是文件的路径，第二个元素是文件要打包到的文件夹。

比如说，如果要一起打包`a/b/c.txt`文件，`datas`中就应该添加一项`[('a/b/c.txt', 'a/b'), ]`，含义是告诉 PyInstaller 要把`。/b/c.txt`文件打包到`a/b`文件夹中，如果要打包整个文件夹，我不太确定能不能直接填写文件夹的路径，我是选择了用 python 列出文件夹内的所有文件，然后一股脑的添加到 datas 里面。

而如果你用到的某个依赖（没错，在我这个例子里面就是`peewee-migrate`，他有一个`template.txt`文件，是在运行的时候动态读取的，同样需要添加到 datas 中。

就是这段代码实现的功能

```python
package_imports = [
    ['peewee_migrate', ['template.txt']],
]
datas = []

for package, files in package_imports:
    proot = os.path.dirname(importlib.import_module(package).__file__)
    datas.extend((os.path.join(proot, f), package) for f in files)
```

在`package_imports`中定义每个包需要额外引入的文件，在下面循环中找到所有需要打包的文件的路径，然后添加到 data 中去。

## 支持 entry_point

这个支持 entry point 的意思不是说，我用来有一个用`console_scripts`做为入口的 python 程序如何用 pyinstaller 打包。

而是说，如果你在`entry_points`里添加了其他的东西，比如说我的 python 程序中添加了这样的几个`entry_points`。

```ini
[options.entry_points]
bgmi.downloader.delegate =
  aria2-rpc = bgmi.downloader.aria2_rpc:Aria2DownloadRPC
  deluge-rpc = bgmi.downloader.deluge:DelugeRPC
  transmission-rpc = bgmi.downloader.transmissionRpc:TransmissionRPC
```

如果程序是通过`pip install -e .`安装到 python 环境中的，在运行程序的时候可以正常被`load_entry_point`加载。

但如果是在 pyinstaller 打包出来的二进制中，默认程序是无法加载到任何`entry_points`的，因为`PyInstaller`默认只会打包所有的 py 文件，而一个包的`entry_points`的信息保存在`package`同级的目录`package.egg-ino/entry_points.txt`文件中，需要用之前提到的办法，把这个文件夹也打包进去，而且要跟`package`同级。这样在运行释放临时文件的时候，才能正常加载`package`对应的`entry_points`。
