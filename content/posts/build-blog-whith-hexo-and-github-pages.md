---
categories:
  - 编程
date: "2016-04-16T01:03:39+08:00"
tags:
  - git
  - nodejs
  - github
title: 利用hexo和GitHub pages服务搭建博客
type: post
---

使用 GitHub actions 自动部属博客到 GitHub pages。

<!-- more -->

## GitHub Pages 介绍

github pages 是 github 提供的服务，github 会为特定仓库的默认分支（比如 `${username}.github.io` ）或者其他仓库的 `gh-pages` 分支提供静态文件服务。

`${username}.github.io` 仓库的文件会直接放在 `${username}.github.io` 域名的根目录下，其他的仓库则会放在`/${repo_name}/` 子目录下。

比如，我在 `blog` 仓库下创建 `gh-pages` 分支，在根目录创建一个 `index.html` 文件。以我的用户名`trim21`为例，访问 `https://trim21.github.io/blog/index.html` 就可以正常看到文件。

## GitHub Actions

2019 年 GitHub 上线了自己的 CI，[GitHub Actions](https://docs.github.com/cn/actions)，在此之前大家一般会使用 travis CI 或者 circle CI 等。但是直接用 github actions 可以避免额外注册账号，设置 github access token 等等权限问题。

有了 github actions 之后就不再需要博客提供的各种部属插件了，只需要在 github actions 中构建博客，并且把生成的`public/`文件夹推到`gh-pages` 分支就可以了。

```yaml
name: build

on:
  push:
    branches:
      - master

jobs:
  main:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup node
        uses: actions/setup-node@v3
        with:
          node-version: "16"

      - name: install
        run: yarn

      - name: build
        run: yarn build

      - name: Deploy
        uses: peaceiris/actions-gh-pages@v3
        with:
          publish_dir: ./public
          commit_message: deploy ${{ github.ref }}
          cname: blog.trim21.me
          github_token: ${{ secrets.GITHUB_TOKEN }}
```
