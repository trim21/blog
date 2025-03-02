---
categories:
  - 工具
date: "2019-10-23T00:00:00+08:00"
title: 输入法切换到Rime
type: post
updated: 2021-08-13
---

QQ 拼音终于也开始弹广告了，所以一怒之下准备删了。

又不能没输入法用，就用上了小狼毫。记录一下这中间遇到的若干坑。

<!-- more -->

![最终设置的效果](/static/rime-preview.jpg)

## 安装

一路下一步，唯一的坑在于`自定义用户文件夹`这个功能。**不要设置自定义用户文件夹**。

如果是为了 rime 的多平台同步，rime 有另一个同步功能可以进行同步，而不需要同步整个用户文件夹。

rime 有一个包管理器，但是这个包管理器在 windows 上并不能正确的识别用户文件夹：无论用户怎么设置，包管理器都会认为用户文件夹在默认的 `%APPDATA%/rime`。包管理器也只会把下载到文件安装到这个路径里面，但小狼毫只从用户设置的文件夹中加载配置。这样一来，包管理器完全无法工作。

## 同步

同步 rime 有一个自带的同步功能，也就是安装完后看到的`【小狼毫】用戶資料同步`开始菜单选项。

首先打开用户文件夹中的`installtion.yaml`（我就不介绍 yaml 语法了）
，添加一个`sync_dir`选项指向你想要同步的位置，比如我设置的是`$OneDrive/rime`，那么在点击同步之后，rime 会在`$sync_dir`文件夹下新建一个文件夹，名为这个文件里面的`id`一项（这一项你也是可以改的，比如我改成了`windows`），然后把你这台机器里面的所有配置和和词库同步过去。

如果 rime 在这个文件夹下面还找到了其他机器的同步结果，他还会合并其他机器的词库，所以只要定时的让小狼毫自动同步，就能解决多台机器的同步问题。

## 设置

Rime 所有的设置（除了词库文件）都是 yaml，为了能合并不同的 YAML 中的，rime 用到了一些关键词比如`patch`。

小狼毫的配置文件在`$RIME_CONFIG_DIR/weasel.custom.yaml`中。

### 设置外观

#### 设置候选词数量

```yaml
patch:
  "menu/page_size": 9
```

#### 设置主题

```yaml
patch:
  "style/color_scheme": steam
  "style/font_face": "Microsoft YaHei" # 显示字体
  "style/font_point": 14 # 字体大小
  "style/horizontal": true # 水平显示
  "style/layout/margin_x": 7 # 窗口边界距离
  "style/layout/margin_y": 7 # 窗口边界距离
  "style/layout/spacing": 2 #候选竖排时候与候选词的间距
  "style/layout/candidate_spacing": 1 # 候选间距
  "style/layout/round_corner": 8 # 圆的拐角
  # 还有一些额外的设置，这不是完整的列表，只是我用到的
```

`style/color_scheme` 设置了内置的配色方案，完整的列表可以在这里找到 [https://github.com/rime-aca/color_schemes](https://github.com/rime-aca/color_schemes)

如果觉得内置的都不好看，可以用[配色方案生成器](https://bennyyip.github.io/Rime-See-Me/)自己设计一个。

### 设置输入方案

输入方案的设置在 `$RIME_CONFIG_DIR/default.custom.yaml`。

```yaml
patch:
  schema_list:
    - schema: double_pinyin_flypy
```

`double_pinyin_flypy` 从[这里](https://github.com/rime/rime-double-pinyin)安装，我是直接复制了原文件到我的配置文件夹中。
