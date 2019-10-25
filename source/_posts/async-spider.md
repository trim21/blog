---
title: 一个可以控制并发的小爬虫
date: 2016-05-21 02:57:29
updated: 2016-05-21 02:57:29
categories:
- 编程
tags:
- nodejs
- javascript
- async
---

最近好几个地方需要用到爬虫,解决了一下并发的问题

学校的选课系统的课容量做不到实时更新,但是一天更新一次还是可以的.但是用node直接一个for循环就几十个几百个http请求易轻尘发出去了.顶多能成功1 2个,后面的就全都失败了.所以需要控制并发.

<!-- more -->

# Async

Async是一个控制控制异步流程的库.可以控制异步函数执行的顺序.

from [http://blog.fens.me/nodejs-async/](http://blog.fens.me/nodejs-async/)

一句话概括,就是如果你想要循环执行异步代码,可以用async来控制异步执行流程.用maplimit甚至还可以控制并发.

之前想要把异步的第三方库同步化的时候找了一些方法,偶然看到了这个库,发现有些时候异步库同步化是不可能的,走偏路,应该直接异步处理.

```javascript
var n = require('needle');
var async = require('async');
var fs = require('fs');
var arr = [];

var start = -15;
var step = 100;
var end = 10000;

for (conditions) {
  arr.push(url());
}

spy(arr);

function url(x) {
  return 'url';
}

function spy(array, resp) {
  console.log('arr', arr);
  console.log('resp', resp);
  if (array) {
    async.mapLimit(arr, 3, reqAndWrite, spy);
  } else {
    console.log('finish');
  }
}

function reqAndWrite(x, callback) {
  var u = url(x);
  n.get(u, { encoding: 'gb2312' }, function (err, res) {
    if (res || ("body" in res) || (err)) {
      fs.writeFileSync('table/' + x + '.html', res.body);
      callback(undefined, x);
    } else {
      callback(x);
    }
  });
}
```

这是我用来抓学校选课系统的爬虫,学校系统比较简单,只需要不停地GET就能取到数据.这里是直接把爬回来的数据存到了文件里.

用到的http请求的库是`needle`,之前没仔细去啃`request`的文档的时候没找到怎么解决编码问题.学校的系统比较老,用的是`gb2312`的编码.

map的使用方法是这样的

```javascript
async.map(array,your_function,callback);
```

`array`中元素会分别传递给`your_function`
在`your_function`中调用`callback`,在`array`中所有的元素都经过`your_function`处理过之后,结果会拼接为一个数组传递给`callback`

比如说,

```javascript
var async=require('async');
var arr=[1,3,5,7];

function my_function(x,callback){
    callback(undefined,x+1);
}

async.map(arr,my_function,function(array,res) {
    console.log(res);
});
```

数组中的每一个元素分别传递给`my_function`,然后调用callback,最后的结果会是

```js
[2,4,6,8]
```

相应的有一另外一个方法`mapLimit(coll, limit, iteratee, [callback])`,其中limit可以设置最大同时进行的函数的数量.只要在这里设置一个比较小的数字,就可以控制并发了.(因为我们学校选课系统比较脆弱,我设置了3或者5)

## 递归

为了保证所有的课表都被爬一遍,如果是同步的话可以用循环来进行,但是这里是异步,我没想到怎么通过循环来进行,所以用了递归.
