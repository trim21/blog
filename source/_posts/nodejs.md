title: 选课系统真难用
date: 2016-04-15 19:07:25
categories:
- 编程
tags:
- node
- JavaScript
- http
---

# 准备自己给学校的选课系统套个壳

## 起因
学校的选课系统真是太难用了，且先不说稳定性（因为到了抢课高峰期必然会无响应，问题是学校所有的课的都不是先选就一定能上的，何必抢呢），就是交互上也非常的难用。
<!-- more -->
在选课的时候由老师先给我们一个excel表格。

|课程号|课序号|课程名|
|:--:|:--:|:--:|
|sd03410420|300|光学|
|d034101231|0|力学|

在一个表格中，会有这么个附件，在一个附件中找到自己的想要选的课，然后把课程号和课序号分别粘贴到网页的一个表单上去，然后提交，就算你选了这一节课了。在高峰期经常连那个表单都获取不到，不知道学校的服务器是什么架构，所以也无从得知到底卡在哪里了。（现在是非选课时期，所以选课系统没开，没法截图了，等着有机会再补上吧）

所以我想干脆我自己做一个吧。就不用受学校的选课系统的煎熬了，再怎么做也不至于比学校的选课系统更差。

所以有了现在做的这个东西。其实一开始纠结用什么做费尽了半天。一开始对现在编程的环境没什么了解，想直接用很地政的语言画个GUI，然后把数据直接存到比如说数组里来着，然后连个简单的GUI都画不出来。一直卡在画GUI上，然后就把这个想法放下了。

## 开始

直到后来知道了node.js。并且真正的用了一下，发现原来写个服务器是这么简单。。。


```javascript
var http=require('http')
http.createServer(function (req, res) {
    res.send('hello world');
}).listen(3000);

```



用四行代码在3000端口就已经开了一个服务器了，显示的是只有`hello world`这么一句话的网页。

然后我就决定又开始做这个了，html就是现成的图形界面，而且在浏览器里直接就跨平台了，无比省劲。

腾讯云给的1块钱的服务器，加上一个免费域名，正好所有条件都有了，所以就开始做吧。直接开始干吧。

## Express介绍

其实一开始写了不少东西，后来又发现了express这个东西，路由功能和各种parser个能也都很好用，省掉了好多地方，其实自己也不怎么会写。所以用这个正好。

express真是个好东西,直接用generator生成的话各个中间件都已经预置好了.如果是用generator生成的话可以直接安心写路由了.不需要管接受的数据是是buffer还是stream.有body-parser和cookie-parser来处理.


中间件的概念我不知道出处是什么了.在express里中间件就是对一次http请求进行处理的一个函数.可以传递给下一个函数急需处理,也可以在这个函数就终止.

比如说,在express的app.js文件中就可以看到


```javascript
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);

```
代码分成了三部分

```javascript
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
```
第一部分如注释所说,使用了`jade`做为模板引擎

```javascript
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
```

然后引入了一系列的中间件,对http请求进行预处理.

最后是路由部分.

```javascript
app.use('/', routes);
app.use('/users', users);
```

如果访问`domain/`就会交给`routes`函数进行处理.如果访问的时`domain/users`就会交给`users`函数进行处理.

一个路由对象也很好写

```javascript
var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;
```
这是自动生成的`users`,`router`是express提供的对象.他的方法名就是要进行处理的http的请求的方法.比如处理get请求就用`router.get`,处理post请求就用`router.post`

第一个参数是要处理的路径.是累加在之前那个路径上的.也就是说,我们在app.js中已经设定了是`/users`路径了,如果这里写的是`router.get(/example,function(req,res,next){});`那么只有url是`domain/users/example`的请求才能被这个函数所捕获.


还有一个url静态化的方法,我不知道了=.=没用过,只看了一眼.似乎是引入一个什么什么东西,然后在url中用`:vars`来匹配参数.

如果是post方法,req对象有一个body属性.其中储存了post所附带的对象.如果是get对象,则是`req.query`.中间件已经替我们处理好了这部分东西,不需要我们再处理了.

毕竟是说不要重复造轮子嘛=-=已有的现成的东西自己重写一遍也没有什么意义.

## sqlite3

### nodeJS中slite3安装

sqlite3的数据库是储存在一个文件中的,不像MySql一样需要开一个服务.所以安装部署比MySql简单多了.

(我当时部署mysql部署了好几天也没成功.用sqlite3就添加了个环境变量就成功了..)

本身需要储存的数据也不多,就一个学校的课表,在加上储存一个用户的课表.本身用的人也不会很多.所以对性能也不是很敏感.

sqlite3的基本结构跟一个excel表格其实是一样的...一个xls文件里面会有许多个sheet,对应一个db文件中有多个tables,一个sheet有许多个单元格,对应的一个tables里有许多单元格.

nodejs中操作sqlite3也很简单,

```
$ npm install sqlite3 --save
```

编译sqlite3的时候用到了`node-pre-gyp`,win下面好像是自带的.但是linux的话需要先全局安装,不然会报错.

```
$ npm install node-pre-gyp -g
```
`node-pre-gyp`需要python版本`>2.5 <30`,一般来说现在的linux发行版都已经预装了python2.7了,所以只需要全局安装一下`node-pre-gyp`就可以了.


### 使用

```javascript
var sqlite3 = require('sqlite3');

var db = new sqlite3.Database('path of datebash file');
```
db对象有几个方法,查询用到的是`db.get`和`db.all`,第一个方法会返回查询到的第一个条件`all`会返回所有符合条件查询结果.

```javascript
db.all('SELECT * FROM tablename ;' ,
function(er,res){
  if(!err) cosole.log(res);
});
```

这里处理返回值的方法不像其他的语言一样是用函数返回值来进行的,而是用异步的方式,传递一个函数进去处理.

## 异步

node中绝大部分的函数都是异步的,以文件操作来局里,
```javascript
var fs = require('fs');

fs.readFile('file', function (err, res) {
  console.log(res);
});
```

此处是用异步方法读取文件.所以是传递一个函数进去.做为回调函数.

node是单线程的,如果等着读取文件就会卡在这里停止继续运行了.为了解决这个问题,函数是被事件触发来运行的.比如说这里,文件读取的操作是运行时来进行的.在读取操作结束后才会调用回调函数.

在读取的这段时间里会继续运行.

```javascript
var fs = require('fs');

fs.readFile('file', function (err, res) {
  console.log('world');
});
console.log('hello')
```
以这段代码为例,控制台会输出的是
```
hello
world
```
而不是按照代码顺序的
```
world
hello
```
就是因为运行`fs.readFile`需要耗费一定的时间,在这个时候是运行时进行I/O操作,而代码则继续运行,先运行到了`console.log('hello')`

所以个人感觉,node是树一样的状态.每写一个回调就相当于分了一个岔,运行时在其中一条阻塞的时候就跳到另外一条树干上执行.直到这条树干运行到头为之.


