---
categories:
  - 编程
date: "2018-10-05T17:42:21+08:00"
tags:
  - python
title: 基于asyncio的web框架aiohttp
type: post
---

本来想扯一通标准库里添加了`asyncio`的意义, 什么统一了异步框架, 什么方便代码前移之类的了.
然后发现原来大家也都是用装饰器+生成器来写的, 好像也没啥区别...

迁移的主要阻力也不是各个框架实现异步的方式不同, 而是用到了框架的某些特性, 在其他框架里可能没有, `asyncio`成为标准库也改变不了这一点.

不过 python3.4 3.5 3.6 添加了很多新功能,语言层面的异步支持越来越好了

在 3.4 就是上面说的, 引入了`asyncio`的标准库.

3.5 有了一系列的 bug fix ,可以见[why-is-python-3-5-3-the-lowest-supported-version](https://aiohttp.readthedocs.io/en/stable/faq.html#why-is-python-3-5-3-the-lowest-supported-version), 还支持了`async/await`语法.

<!-- more -->

不过 3.5 的时候`async/await`还不是关键字, 还可以给`async`赋值, 所以到了 python3.7 的时候挂了一堆库, 因为他们用了`async`当变量...

```python
import asyncio
import sys

print(sys.version_info) # 3.5.4


async def hello():
    print("Hello world!")
    # 异步调用asyncio.sleep(1):
    r = await asyncio.sleep(1)
    print("Hello again!")


async = 1
print(async)

# 获取EventLoop:
loop = asyncio.get_event_loop()
# 执行coroutine
loop.run_until_complete(hello())
loop.close()
```

会输出

```bash
1
Hello world!
Hello again!
```

但是如果到了 python3.7, 会报错`SyntaxError`, 也因为这个原因挂了一堆库.

```bash
  File "app.py", line 14
    async = 1
          ^
SyntaxError: invalid syntax
```

比如说 twisted, python3.7.0 是 6 月 27 号发布的, 但是直到到前两天(2018-10-05), pypi 上的最新版本还不能正常运行...

说了半天没用的...

最近在折腾的 python 框架 aiohttp 其实没有这个问题. 因为 aiohttp3.x.x 的最低版本要求就是 3.5.4, 从一开始就用到了`async/await`, 自然也不会有某个开发者把 async 再当作函数参数或者变量来赋值.

出于好奇, 还是了解了一下 aiohttp 这个框架, 写了几个小玩具.

```python
from aiohttp import web
import asyncio

route = web.RouteTableDef()


async def index(request):
    await asyncio.sleep(1)
    return web.Response(text='hello world')


@route.get('/about')
async def about(request):
    return web.Response(text=request.app.version + ' author Trim21<trim21me@gmail.com>')


@web.middleware
async def middleware(request, handler):
    # before handle request
    resp = await handler(request)
    return resp


def create_app():
    app = web.Application(middlewares=[middleware, ])
    app.version = '0.0.1'
    app.add_routes([
        web.get('/', index, name='index'),
    ])
    app.add_routes(route)
    return app


web.run_app(create_app())
```

一个简单的例子, (如果需要数据库的话, 官方的例子是把 mongo 的连接池绑在了`app.mongo`上.)

前面提到了, 语言层面的异步支持是越来越好了, 但是类库的支持还是有些匮乏.

mongodb 和 redis 的支持还算可以, mongodb 的官方自己写了[`motor`](https://github.com/mongodb/motor), aiohttp 的开发者写了[`aioredis`](https://github.com/aio-libs/aioredis).

但是如果想找一个异步的关系型数据库的 ORM 就非常难了. [SQLAlchemy 的作者曾经写过一篇文章](http://techspot.zzzeek.org/2015/02/15/asynchronous-python-and-databases/), 说因为 python 本身就很慢, 所以异步也没有意义, 反而比同步还要慢.

~~但我还是相信 python, 会有那么一天变快的(~~

异步的 SQL ORM 主要有这么几个

1. [`peewee-async`](https://github.com/05bit/peewee-async)
2. [`gino`](https://github.com/fantix/gino)

`gino`直接 pass, 因为目前只支持 postgreSQL.

`peewee-async`的问题是, 他其实是基于 peewee 的, 你要通过 peewee 来定义你的模块, 然后用`peewee-async`给的一个`Manager`来异步调用.

举个例子, 他的异步代码是长这样的

```python
import peewee
from peewee_async import Manager, PostgresqlDatabase


class User(peewee.Model):
    username = peewee.CharField(max_length=40, unique=True)


class Twitter(peewee.Model):
    user = peewee.ForeignKeyField(model=User, backref='tweets')


objects = Manager(PostgresqlDatabase('test'))
objects.database.allow_sync = False  # this will raise AssertionError on ANY sync call


async def my_async_func():
    user0 = await objects.create(User, username='test')
    user1 = await objects.get(User, id=user0.id)
    user2 = await objects.get(User, username='test')
    # All should be the same
    print(user0.id, user1.id, user2.id)
    print(user0.tweets)  # raise exception here
```

像这个例子比较简单, 就只有一个外键, 还添加了`backref`, 就容易出问题了.

因为本身是异步框架, 所以同步的代码都会阻塞整个事件循环, 在使用 orm 的时候会先设置禁止同步链接数据库, 只允许异步链接. 但是如果用了外键, peewee 在你试图获取对应的属性的时候就会链接数据库, 取回对应的数据. 所以如果用了外键, 在查询和使用实例的时候总要小心翼翼的, 以避免触发同步查询.

也许不用外键, 直接存 id 进去, 不依赖数据库的约束, 而在 web 层面约束可能好一些, 不会出现类似的问题.

ORM 扯完了, 几个经常会用到的东西.

模板: [`aiohttp-jinja2`](https://github.com/aio-libs/aiohttp-jinja2)

session: [`aiohttp-session`](https://github.com/aio-libs/aiohttp-session)

辅助的开发服务器, 支持 livereload 和 hotreload[`aiohttp-devtools`](https://github.com/aio-libs/aiohttp-devtools)

devtools 有一些坑, 主要是项目的 readme 不是很全, 主要还是要靠 cli 的 help 信息和源码...

比如, 我的项目结构是这样的

```bash
project
├─ Dockerfile
├─ README.md
├─ requirements.txt
└──app
   ├─ main.py
   ├─static
   │  └─css
   │    └── 1.css
   └──templates
      └── index.html
```

这里有一个潜在的坑, 如果你要在`project`目录下直接启动服务器的话, 是不能提供`app-path`的, 而是用通过`--root`来启动, 比如说`adev runserver --root app`

但是如果你的`pwd`是`app`, 此时不需要提供`root-path`, 只需要提供`app-apth`, 启动命令变为`adev runserver main.py`

贴一下`runserver`的 help 信息

```plain
Usage: adev runserver [OPTIONS] [APP_PATH]

  Run a development server for an aiohttp apps.

  Takes one argument "app-path" which should be a path to either a directory
  containing a recognized default file ("app.py" or "main.py") or to a
  specific file. Defaults to the environment variable "AIO_APP_PATH" or ".".

  The app path is run directly, see the "--app-factory" option for details
  on how an app is loaded from a python module.

Options:
  -s, --static DIRECTORY          Path of static files to serve, if excluded
                                  static files aren't served. env variable:
                                  AIO_STATIC_STATIC
  --root DIRECTORY                Root directory project used to qualify other
                                  paths. env variable: AIO_ROOT
  --static-url TEXT               URL path to serve static files from, default
                                  "/static/". env variable: AIO_STATIC_URL
  --livereload / --no-livereload  Whether to inject livereload.js into html
                                  page footers to autoreload on changes. env
                                  variable AIO_LIVERELOAD
  --host TEXT                     host used when referencing livereload and
                                  static files, if blank host is taken from
                                  the request header with default of
                                  localhost. env variable AIO_HOST
  --debug-toolbar / --no-debug-toolbar
                                  Whether to enable debug toolbar. env
                                  variable: AIO_DEBUG_TOOLBAR
  --app-factory TEXT              name of the app factory to create an
                                  aiohttp.web.Application with, if missing
                                  default app-factory names are tried. This
                                  can be either a function with signature "def
                                  create_app(loop): -> Application" or "def
                                  create_app(): -> Application" or just an
                                  instance of aiohttp.Application. env
                                  variable AIO_APP_FACTORY
  -p, --port INTEGER              Port to serve app from, default 8000. env
                                  variable: AIO_PORT
  --aux-port INTEGER              Port to serve auxiliary app (reload and
                                  static) on, default port + 1. env variable:
                                  AIO_AUX_PORT
  -v, --verbose                   Enable verbose output.
  --help                          Show this message and exit.
```

其中, `-s, --static`因为实际上静态文件要通过`--aux-port`去访问, 所以感觉有些鸡肋.

也就是说, 如果正常的服务器启动在`6001`端口, 而`aux-server`启动在`6002`端口, 我们要使用这个参数代理的静态文件的话, 要访问`http://localhost:6002/static/1.css`, 而正常我们会把静态文件放在同一个域名下, 也就是`http://localhost:6001/static/1.css`, 所以我的选择是直接添加一个`web.static`的路由, 而不是使用的这个功能.
