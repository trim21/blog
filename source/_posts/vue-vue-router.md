---
title: 使用vue和vue-router开发网站
updated: 2017-05-14 05:37:18
date: 2017-05-14 05:37:18
categories:
- 编程
tags:
- javascript
---

最近要开发一个网页,放在服务器上作展示用.专门去学个php吧又不值得,而且还要部署,太麻烦.直接用vue,经过webpack打包成静态文件丢给nginx正好,本来也没什么后台功能,真是纯展示用的.正好用vue练手.
<!-- more -->

## 环境搭建

- nodejs 7.4.0(看了官网,最新版已经到了7.10.0)
- npm 4.5.0
- vue-cli 2.8.1
- vue 2.3.3
- vue-router 2.5.3

`vue-cli`是一个用来搭建项目的工具,用来生成vue项目的一些基本的结构.

首先

```bash
npm i vue-cli -g
```

安装vue-cli,安装完成后使用

```bash
vue init template-name project-name
```

来新建项目.比如我用的是webpack,`vue init webpack project-name`
他会下载模板,然后询问一些设置的问题,如项目名,项目描述,作者等.还会问构建方式,因为我需要输出为静态文件,所以选择了`runtime+compiler`,还会询问是否要使用vue-router.回答完所有的问题之后会发现现在的目录下多了一个`project-name`的文件夹,就是`vue-cli`创建好的项目文件夹.

按照他的提示

```bash
cd project-name
npm i
npm run dev
```

在安装完依赖后就可以看到相应的页面了.

![hello world]](https://ws1.sinaimg.cn/large/bd69bf14ly1ffmycii112j20jr0hfjs9.jpg)

(插了张微博的https的图片,看来是会不会影响小绿锁)

```bash
.
|-- README.md
|-- build
|   |-- build.js
|   |-- check-versions.js
|   |-- dev-client.js
|   |-- dev-server.js
|   |-- utils.js
|   |-- vue-loader.conf.js
|   |-- webpack.base.conf.js
|   |-- webpack.dev.conf.js
|   `-- webpack.prod.conf.js
|-- config
|   |-- dev.env.js
|   |-- index.js
|   `-- prod.env.js
|-- index.html
|-- package.json
|-- src
|   |-- App.vue
|   |-- assets
|   |   `-- logo.png
|   |-- components
|   |   `-- Hello.vue
|   |-- main.js
|   `-- router
|       `-- index.js
`-- static
```

生成的项目结构是这样的.
`build`和`config`分别是与项目构建和设置有关的一些文件.如果没有什么特殊需求的话不需要更改.
我们需要编辑的就是src里面的文件了.其中`App.vue`是根组件,现在里面有一个`<router-view>`的标签,是后面`vue-router`用到的.

## vue-router

vue-router的是用来管理spa的路由的.

example:

```javascript
import Vue from 'vue';
import VueRouter from 'vue-router';

import store from '@/store';
import Login from 'components/login';
import Index from 'components/index';

Vue.use(VueRouter);
const routes = [
  {
    path: '/',
    component: Login,
  }, {
    path: '/index',
    component: Index,
    meta: {
      requireAuth: true,
    },
  },
];

const router = new VueRouter({
  routes, // （缩写）相当于 routes: routes
});

router.beforeEach((to, from, next) => {
  if (to.meta.requireAuth) {  // 判断该路由是否需要登录权限
    if (store.state.isLogin) {  // 通过vuex state获取当前的token是否存在
      next();
    } else {
      next({
        path: '/',
        query: { from: to.fullPath },
         // 将跳转的路由path作为参数，登录成功后跳转到该路由
      });
    }
  } else {
    next();
  }
});

export default router;
```

跟其他的`vue`插件一样,需要`Vue.use(VueRouter)`来注册.
引入其他的组件,给每个path指定好相应的组件.
[官方文档](https://router.vuejs.org/zh-cn/)

其中的store是由于要使用vuex而引入的.

## Vuex

vuex是官方提供的状态管理工具.当初没明白这个状态管理工具是怎么个意思,实际用起来才发现,就是当你在不同组件中要使用一份共同的数据的话,就要通过vuex来管理,不然不同组间之间还要emit和on,兄弟组间之间沟通就更麻烦了.

```javascript
import Vuex from 'vuex';
import Vue from 'vue';

Vue.use(Vuex);
const state = {
  isLogin: false,
  auth: '',
  lessons: [],
};

/* eslint-disable no-new */
const store = new Vuex.Store({
  state,
  // 定义状态
  /* eslint-disable no-param-reassign,no-shadow*/
  mutations: {
    login(state, auth) {
      state.isLogin = true;
      state.auth = auth;
    },
    setLessons(state, lessons) {
      state.lessons = lessons;
    },
  },
});


export default store;
```

首先仍然是通过`Vue.use(Vuex)`来注册插件(如果是在html中直接使用cdn提供的vuex就不需要这一步了,引入的时候会自动进行.)

然后定义一个`state`对象,其中是我们需要用vuex来管理的数据.比如我需要储存`isLogin`是否登录,`auth` 认证的token,还有`lessons`,这是要上的课程.
除了`state`,还有一个是`mutations`,要修改vuex中的数据只能通过`mutations`或者`action`进行`mutations`中只能进行同步操作,而`action`中只能进行异步操作.我没有用到action的地方.

因为我实际的需求其实修改其中的几个数据,所以两个`mutations`其实都只是修改state中的值.
