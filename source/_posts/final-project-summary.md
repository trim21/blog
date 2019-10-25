---
title: 毕业设计每周总结
date: 2019-03-25 18:05:10
categories:
- 编程
tags:
- git
- golang
- python
---

毕业设计要做一个文件同步服务器, 用在老师的实验室里会产生一些科研数据, 根据使用的软件的不同, 可能有二进制和文本多种数据.

生成的文件大约会有几百兆, 需要同步备份到一个中心服务器中.

<!-- more -->

## 第一周

调研服务器和客户端相关使用的技术种类

同步算法分大类有两种, 一种是判断文件内容是否发生了修改, 如果发生了修改, 直接同步整个文件. 这种办法比较适合二进制文件, 比如word文件, ppt, 照片等. 实现比较简单, 代码量比较小, 但是因为在网络上传输的文件内容相应的比较大, 需要的网络带宽比较高.

另一种是增量同步. 通过扫描检测文件内容发生的具体更改, 进行diff和patch, 在网络上传输的时候只需要传输某些diff和patch就可以保证文件状态的同步. 但这种办法牵扯到具体文件差异的检测, 可能需要保存文件快照等.

## 第二周

### redis锁的实现

redis是一个key-value的存储系统, 可以存储特定的key和value来实现一个锁.

比如: 对于名叫`key`的资源加锁, 可以设置`key`对应的value为1.

通过redis支持的lua脚本来判断. 如果存在某一个key:`key`, 然后这个`key`的value为1, 就返回一个`None`. 说明此资源已经被加锁, 无法重复加锁. 如果不存在对应的value或者这个`key`已经过期了, 说明这个资源已经没有了锁, 可以把这个资源加锁.

### 读写锁的特点

1. 在写锁未被锁定的时候才能获取读锁
2. 在读锁未被锁定的时候才能获取写锁
3. 在速锁被获取到的情况下, 仍然可以获取读锁
4. 在写锁被锁定的情况下, 不能再获取写锁

读写锁有两种情况

1. 读阻塞, 在有读锁的时候, 写锁获取直接失败. 有可能等到死都无法等到写锁.
2. 写阻塞, 在有客户端试图获取写锁的时候, 不能增加读锁

### redis实现读写锁

针对每一个资源, 有读锁和写锁两个资源. 读锁和写锁. 读锁可重入(计数+1), 写锁则是常见的redis锁.
在读锁对应的值不为0的情况下写锁无法获取.

### 实现服务器的认证功能

使用的是[aiohttp-security](https://github.com/aio-libs/aiohttp-security)

复制了源码并且进行了一些修改, 原来有一些多余的限制. 比如每个用户的`identify`比如为字符串, 每次检查授权都需要读取数据库, 无法直接使用缓存判断用户是否已经登陆(缓存也使用redis)

## 第三周

客户端使用的是Golang来实现, 编译最后只有单个的可执行文件, 不用解决依赖的问题.

实现客户端的文件修改监控, 数据库, 用来修改配置的web-ui

### web-ui

使用[iris](https://github.com/kataras/iris)的web框架, 模板直接使用golang的`html/template`标准库. 使用bindata来把对应的模板打包到二进制文件中.

数据库使用的是[xorm](https://github.com/go-xorm/xorm), 在本地中则使用的是sqlite(mysql之类的在客户端中使用不合适)

监控文件修改使用的是[fsnotify](https://github.com/fsnotify/fsnotify)

## 第四周

先实现一个整体同步的文件算法, 对应的差分算法再实现.

### 服务端

因为用户可能上传非常巨大的问题, 所以必须要流式处理对应的文件内容.
aiohttp给了一个`request.multipart`, 用来处理这样的情况.

```python
    multipart = await request.multipart()
    while True:
        reader = await multipart.next()
        if not reader:
            break
        if reader.name == 'metadata':
            metadata.update(await self.get_metadata(reader))
            continue
        elif reader.name == 'file':
            get_file = True
            await self.ensure_dir_exists(rel_path)
            async with aiofiles.open(os.path.join(config.FILE_DATA_DIR,
                                                  rel_path, filename),
                                     'wb') as f:
                while True:
                    chunk = await reader.read_chunk()
                    if not chunk:
                        break
                    size += len(chunk)
                    await f.write(chunk)
            metadata['size'] = size
```

读出metadata的同时把对应文件的内容写到相应的硬盘文件中. 然后处理完整个请求体再把`metadata`存到数据库中.
(文档中给的multipart的例子居然是直接`open`了一个文件进行读写, 怎么一点也不担心阻塞问题的...)

### 客户端

客户端这边, golang比较好用的http client是`github.com/ddliu/go-httpclient`

#### 工作流程

##### 初始化

在第一次启动的时候, 全盘扫描. 扫描所有的文件.

保存所有的文件尺寸, `metadata`到数据库中.

服务器上的文件列表.

在文件内容发生修改的时候, 更新数据库内容

server

## todo:

- [ ] func
