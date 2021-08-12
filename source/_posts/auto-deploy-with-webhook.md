---
title: 自动重新构建部署博客
date: 2017-05-14 04:57:28
categories:
  - 编程
tags:
  - Linux
  - python
  - nodejs
  - hexo
---

想折腾这个很久了,终于把这个折腾好了.

现在写博客的流程是,我在本机维护一个 git repo,里面是我所有的文章.然后我写完一篇文章或者修改了文章之后 push 到 github 上去,相应的 github pages 就会根据用来保存文章的 repo 自动最新的状态.

原本是在自己的 vps 上开了一个服务器处理 webhook, 现在换成了[travis-ci](https://travis-ci.org/)来自动部署.

<!-- more -->

不得不说[travis-ci](https://travis-ci.org/)是个好东西. 如果你是开源项目, 是可以免费使用的, 只有 private 的仓库才需要付费.

写个博客, 自然所有的东西都是公开的, 用他来构建也没什么问题.

唯一的问题是, 构建之后的部署需要密钥, travis 自然也考虑到了这种问题, 可以在`more options`- `settings` - `Environment Variables`中添加保密的环境变量, 这样一来我们只要去 github 生成一个可以 push 的 token, 用这个 token 又可以避免泄露凭证个第三方, 又可以利用公有服务操作我们的个人仓库.

首先生成一个 token, 这个比较简单

因为 github pages 要求 push 到`${username}.github.io`的仓库中, 比如我的用户名是`trim21`, 我就需要把文件 push 到`trim21.github.io`去, 所以我们需要告诉`hexo`他要操作的部署的仓库地址.

而`_config.yml`里面又不能使用环境变量, 只能每次部署的时候把对应的仓库链接给 echo 进去, 避免泄漏.

我的`_config.yml`文件结尾是这样的

```yml
# Deployment
## Docs: https://hexo.io/docs/deployment.html
deploy:
  type: git
  branch: master
```

然后 echo 到`_config.yml`

```bash
echo "  repository: https://${token}@github.com/Trim21/trim21.github.io" >> ./_config.yml
```

就变成了

```yml
# Deployment
## Docs: https://hexo.io/docs/deployment.html
deploy:
  type: git
  branch: master

  repository: https://real_token@github.com/Trim21/trim21.github.io
```

当然, 这里的 token 因为已经在环境变量中设置好了, 所以在配置文件中已经是正确的路径地址了.

而远程地址是这样的情况下, 就可以正常使用`hexo-deploy-git`了, 而不需要额外的设置.

还有一个坑, 因为 travis 不允许从对应的仓库 clone 两次, 所以不能把文章直接 clone 到`source/_posts`去, 要把之前 clone 的文章移动过去...

最后贴一下我的 travis 配置.

其中`git clone https://${token}@github.com/Trim21/trim21.github.io .deploy_git`的一步是多余的, 如果你没有提前 clone 的话, hexo 的部署插件会替你 clone.

而`myecho`文件里除了把正确的仓库地址 echo 的文件里, 还有对应的`hexo g -d`, 和调用腾讯云的 api 来刷新 cdn 缓存.

```yml
branches:
  only:
    - master

language: node_js

sudo: false

node_js:
  - "8.11"

install:
  - sudo apt install libtool automake autoconf nasm -y
  - cd ..
  - git clone --depth 1 https://github.com/Trim21/blog.git
  - git config --global user.name $username
  - git config --global user.email $email
  - cd blog
  - mv ../blog-posts ./source/_posts
  - git clone https://${token}@github.com/Trim21/trim21.github.io .deploy_git
  - npm install
  - git clone https://github.com/Trim21/landscape-plus themes/landscape-plus
  - ls -ahl
  # - chmod +x myecho

script:
  - bash myecho
```
