---
title: 发一个HTTP请求-爬虫要做的第一件事
date: 2020-03-29
categories:
- 编程
- 教程
- python
tags:
- python
---

这是python教程的第二篇（第一篇见{% post_link python-tutorial/install-python %}）

一般提到python，就会说用来写爬虫如何如何。

爬虫会自动的发一些http请求，然后解析服务器返回的结果，得到自己想要的数据。

所以教程的第二篇就从几个简单的http请求开始。

<!-- more -->

先从我们平常上网会接触到的东西开始。

## 什么是网址

![https://www.bilibili.com/](https://tva4.sinaimg.cn/large/bd69bf14ly1gdaneblb19j20c4021q2u.jpg)

在我们访问一个网站的时候，往往是从一个链接点进去的。比如这里的网址是`https://www.bilibili.com`。这就是一个`URL`，或者俗称`网址`。

如果你点进了一个分区，你会发现这个网址变了，比如点进了动画区，网址就会变成`https://www.bilibili.com/v/douga/`然后这个网址甚至还有可能更复杂，比如`https://www.baidu.com/s?wd=123`。但是每个网址都对应一个不同的内容。

这个链接就是在网络上，大家用来区分不同的东西所用的`统一资源定位系统`。

- 统一，是说大家都这么干，B站这么干，微博这么干，百度也这么干。
- 资源，则是比如网站，图片，或者一个视频，都是网络上的一个资源。
- 定位，则是用来确定某个资源的位置。

这个网址分为这么几部分

`https` `://` `www.baidu.com` `/s` `?` `wd=123`

- `https`是说我们访问网站所用到的协议，一般除了`https`还有`http`
- `://`用来区分协议和网址的其他部分
- `www.baidu.com`是域名，比如`www.bilibili.com`，用来区分不同的网站。

而整个网址剩下的部分，则是用来区分同一个网站不同的内容。

- `/s` 则是path，用来在同一个网站中区分不同的内容。
- `?` 用来区分path和路径参数
- `wd=123`则是路径参数，用来告诉服务器wd的值是123。比如一个路径参数是`username=alice`，则是用来告诉服务器用户名是alice。

## 来用python发一个请求

我们先用命令行安装一个python中常用的客户端

```bash
pip install requests
```

pip是python用的包管理器，用于获取别人写的程序（一个包）。我们这里安装了别人写的`requests`。

然后新建一个py文件，这里叫`main.py`吧。

```python
import requests

r = requests.get("https://www.bilibili.com/")
print(r.text)
```

然后在命令行中运行`python main.py`

会打印出这样的东西

![天书](https://tva1.sinaimg.cn/large/bd69bf14ly1gdanepe8k3j20nq0g8k5q.jpg)

是不是让人头大，看不懂输出的都是什么东西，也看不懂程序干了什么事情。

## 从http讲起

http请求是简单地一问一答的模式。用户问一句，服务器才答一句。用户发送的是`http请求`，服务器返回的是`http响应`

而一个http请求可以简单分为四个部分: `方法` `网址` `请求头` `请求体`。
一个http响应则分为`状态码`，`头部`和`响应体`三部分。

方法除了我们已经用过的`GET`，还有`POST`，`PATCH`，`PUT`，`DELETE`等方法。

但我们常用的只有`GET`和`POST`两种，可以按照语意粗略的理解为`GET`用于从服务器获取数据，`POST`用于向服务器提交数据，下面也只会用到这两种方法。

我们这里`GET`了`https://www.bilibili.com/`这个网址。

而我们打印出来的`r.text`则是服务器的响应体

我们用一个http测试网站<https://httpbin.org/#/>来发一些简单地请求。一步一步的理解一个http请求到底包含什么东西。

```python
import requests

headers = {"hello": "world"}

r = requests.get("https://httpbin.org/headers", headers=headers)
print(r.text)
```

我们向`requests.get`传入了`headers`参数，这是一个python的dict，是python内置的数据类型，表示的是键值对的映射。用来告诉requests中headers的`hello`是`world`。

这句话可能有些拗口，举个例子:

```python
headers = {"hello": "world"}
print(headers["hello"])
```

可以看到，程序最后输出了`world`，表示我们通过这个dict，把`"hello"`映射到了`"world"`

我们通过这种方式，用来告诉程序我们这个http请求的headers，而`https://httpbin.org/headers`会把我们的`请求头`作为`请求体`的一部分返回给我们。

所以我们会看到如下的程序运行结果

```bash
python main.py
{
  "headers": {
    "Accept": "*/*",
    "Accept-Encoding": "gzip, deflate",
    "Hello": "world",
    "Host": "httpbin.org",
    "User-Agent": "python-requests/2.23.0",
    "X-Amzn-Trace-Id": "Root=1-5e8010f3-c048dff077b8a11038d41b1c"
  }
}
```

其中`"Hello": "world"`就是我们传入的`headers`。其他的结果则是requests默认的请求头。

我们再加几个请求头:

```python
import requests

headers = {
    "hello": "world",
    "header1": "value1",
    "header2": "value2",
    "header3": "value3",
    "header4": "value4",
}

r = requests.get("https://httpbin.org/headers", headers=headers)
print(r.text)
```

可以看到结果更多了

```bash
python main.py
{
  "headers": {
    "Accept": "*/*",
    "Accept-Encoding": "gzip, deflate",
    "Header1": "value1",
    "Header2": "value2",
    "Header3": "value3",
    "Header4": "value4",
    "Hello": "world",
    "Host": "httpbin.org",
    "User-Agent": "python-requests/2.23.0",
    "X-Amzn-Trace-Id": "Root=1-5e80181d-d51b14b0f5d7e6e095f6e1b0"
  }
}
```

### http报文

http请求是基于文本的，我们可以包http报文直接写出来。

```http
GET https://httpbin.org/headers
User-Agent: python-requests/2.23.0
Accept-Encoding: gzip, deflate
Accept: */*
Connection: keep-alive
hello: world
```

请求中的第一行是方法和网址，第二行开始是我们的请求头。

响应:

```http
HTTP/1.1 200 OK
Date: Sun, 29 Mar 2020 04:09:04 GMT
Content-Type: application/json
Content-Length: 352
Connection: keep-alive
Server: gunicorn/19.9.0
Access-Control-Allow-Origin: *
Access-Control-Allow-Credentials: true

{
  "headers": {
    "Accept": "*/*",
    "Accept-Encoding": "gzip, deflate",
    "Hello": "world",
    "Host": "httpbin.org",
    "User-Agent": "python-requests/2.23.0",
    "X-Amzn-Trace-Id": "Root=1-5e801f60-6329e60e07d01478c4013e68"
  }
}
```

前面说过，一个http响应分为`状态码`，`头部`和`响应体`三部分。

响应的第一行`HTTP/1.1 200 OK`中，`HTTP/1.1`是协议，`200 OK`则是状态码。由一个数字和和一个简单地文本说明来组成。

第二行开始则是响应的`头部`，跟我们的`请求头`一样，由一系列的键值对组成，用来提供响应的附加信息。比如`Date`表示响应的服务器时间，`Content-Type`表示`响应体`中数据的格式，`Content-Length`表示响应体作为文本的长度。

而空行之后到整个响应结束都是`响应体`，也就是我们打印出来的`r.text`。是一个纯文本，但是可以以纯文本来表示各种各样的数据。比如这里用到的是[json格式](https://www.json.org/json-zh.html)，看起来跟python的dict几乎相同。

### to be continued
