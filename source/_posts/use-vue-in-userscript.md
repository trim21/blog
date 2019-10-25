---
title: 在UserScript中使用Vue
date: 2018-10-11 15:26:00
tags:
- vue
- userscript
- javascript
---

之前写了一个用户脚本, [在站外一键点bgm格子](https://github.com/Trim21/bgm-tv-auto-tracker) 为了添加一个UI, 但又不想用jQuery手动绑一堆事件, 就直接上了Vue. 所以需要用Webpack打包对应的vue文件到userscript里. 

<!-- more -->

![效果图](https://ws1.sinaimg.cn/large/bd69bf14ly1fw4c4bspy5j20b10cagmq.jpg)

按钮和弹出框都是Vue做的.

因为之前一直用的是`vue-cli`提供的webpack模板, 所以不太熟悉webpack, 踩了不少坑.

参考[vue-loader](https://vue-loader.vuejs.org/guide/)

首先在webpack的设置中添加一个`loader`, 再添加一个插件

```javascript
// webpack.config.js
const VueLoaderPlugin = require('vue-loader/lib/plugin')
module.exports = {
  module: {
    rules: [
      // ... other rules
      {
        test: /\.vue$/,
        loader: 'vue-loader', 
        options: {
          loaders: {
            scss: 'vue-style-loader!css-loader!postcss-loader!sass-loader',
            // <style lang="scss">
          }
        }
      }
    ]
  },
  plugins: [
    // make sure to include the plugin!
    new VueLoaderPlugin()
  ]
}
```

然后在代码里, 参照Vue官方的模板, 只要初始化一个实例就能正常显示内容了.

```javascript
import App from '. /App'
import Vue from 'vue'
import axios from 'axios'
import $ from 'jquery'

$('#container').append(`<div id='bgm_tv_app'></div>`)
Vue.prototype.$http = axios
// eslint-disable-next-line no-new
new Vue({
  el: '#bgm_tv_app',
  render: h => h(App),
})
```

其中, `el`就是要绑定元素, 因为网页上一般没有, 所以往往还是要用JS手动插一个进去, 然后再初始化Vue.

然后为了能编译出来的文件不会显示一些无用的更改, 最好加上[HashedModuleIdsPlugin](https://webpack.js.org/plugins/hashed-module-ids-plugin/)等.

同时为了减小最后编译出来的脚本文件的体积, 最好使用webpack的external设置, 比如Vue, jQuery之类的.

```javascript
externals: {
  jquery: '$',
  vue: 'Vue',
  axios: 'axios',
  'axios-userscript-adapter': 'axiosGmxhrAdapter',
}
```

这样可以避免webpack把Vue, axios之类库的原文件打包进来, 造成脚本体积非常大.(但是要记得在meta里加上对应的js文件)

\EOF
