---
date: "2025-04-22T17:37:03+08:00"
tags:
  - python
  - packaging
title: python 二进制扩展开发
type: post
---

最近出于兴趣学了一下 c++ 和 rust ， 给 python 写了一些原生扩展。
这个过程中发现相关的中文资料比较少，基本靠啃各种文档，在这里写篇入门博客介绍一下吧。

阅读本文需要比较基础的 python 知识，和比较的 c/c++ 基础知识。在阅读完后预期能写出一个简单地原生扩展的 hello world 程序。

本文大体分为，开发环境准备， c-api 的调用以及打包三部分。

首先， python 的原生扩展就是一个链接了python的动态链接库，并且带有一个特定的导出符号让 python 来加载对应的模块。所以第一步就是编写一个构建系统。

# 开发环境准备

社区一般入门选择是使用 setuptools，但我不太推荐。本文会以 [meson](https://mesonbuild.com/) 作为构建系统来从零开发一个原生扩展。 并且在后续使用 [meson-python](https://mesonbuild.com/meson-python/) 来构建一个可以分发到 pypi 的 wheel 。至于为啥构建c++项目不用 cmake 呢，这是因为我只会用cmake构建别人的软件，自己不会写 CMakeLists.txt ...

这里首先需要安装 meson 和 ninja。 这两个包都是没有依赖的，所以直接用 pip/pipx/uv 全局安装即可。由于本人的习惯所以接下来都会使用 uv 。

```
uv tool install meson
uv tool install ninja
```
