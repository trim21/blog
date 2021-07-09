---
title: 生成bgm.tv关联条目网络
date: 2018-10-11 10:50:36
tags:
  - nodejs
  - bgm
---

本项目已弃坑。

先放成品 [bgm-ip-viewer](http://bgm-ip-viewer.trim21.cn)

在 bgm 上看到有人说现在的关联图只有一层, 看起来不太方便, 就爬了全站数据做了这么个东西.

<!-- more -->

# 爬取数据并生成关联条目网络

## 爬取数据

爬数据用的是`scrapy`, 因为本站有请求速度的限制, 所以数据源是镜像站.

`scrapy`的流程是这样的, 首先继承`scrapy.Item`来定义你自己爬到的数据的模型.

比如我定义了条目 item

```python
import scrapy
from scrapy import Field


class SubjectItem(scrapy.Item):
    # define the fields for your item here like:
    id = Field()
    _id = Field()
    name = Field()
    image = Field()
    subject_type = Field()
    name_cn = Field()
    tags = Field()
    info = Field()

    score = Field()

    score_details = Field()

    wishes = Field()
    done = Field()
    doings = Field()
    on_hold = Field()
    dropped = Field()
```

每个`Field()`中保存的的数据类型可以是 `str`, `int`, `bool`等基础的数据类型, 也可以是`list`, `dict`这种组合类型.

然后写一个解析函数

```python
# -*- coding: utf-8 -*-
from typing import List

import pymongo
from scrapy import Request
from bgm.items import SubjectItem, RelationItem

def url_from_id(_id):
    return 'https://mirror.bgm.rin.cat/subject/{}'.format(_id)

class BgmTvSpider(scrapy.Spider):
    name = 'bgm_tv'
    allowed_domains = ['mirror.bgm.rin.cat']
    start_urls = ['https://mirror.bgm.rin.cat/subject/{}'.format(i)
                  for i in range(1, 270000)]

    def parse(self, response):
        if '出错了' not in response.text:
            subject_item = SubjectItem()

            subject_item['subject_type'] = get_subject_type(response)

            if subject_item['subject_type'] == 'Music':
                return

            subject_item['_id'] = int(response.url.split('/')[-1])
            subject_item['id'] = subject_item['_id']

            subject_item['info'] = get_info(response)
            subject_item['tags'] = get_teg_from_response(response)
            subject_item['image'] = get_image(response)
            subject_item['score'] = get_score(response)
            subject_item['score_details'] = get_score_details(response)

            title = response.xpath('//*[@id="headerSubject"]/h1/a')[0]

            subject_item['name_cn'] = title.attrib['title']
            subject_item['name'] = title.xpath('text()').extract_first()

            for edge in get_relation(response, source=subject_item['_id']):
                relation_item = RelationItem(**edge, )
                yield relation_item
                yield Request(url_from_id(relation_item['target']))
            yield subject_item
```

框架有一个默认的`start_requests`函数, 会请求`starts_urls`里面的链接. 在获取到内容之后会进行一系列处理(比如解析 http, xpath 之类的), 然后交给`parse`函数来处理.

`parse`函数实际上是一个生成器函数, 通过不断`yield`内容来告诉`scrapy`你要做什么.

如果我们需要爬一个新网页, 就`yield`一个`scrapy.Request`, `scrapy`在爬完对应的页面只有会交给对应的回调函数(默认为`parse`)

如果你爬到了一个`Item`, 就直接把对应的实例给 yield 出去. 然后`scrapy`会交给`pipeline`来处理.

在这个例子里, 我需要用到的有两种 item, 一种是`SubjectItem`, 包含条目的某些信息(比如标题, 封面, 对应的`subject_id`, 另一个是每个条目跟其他条目的关系`RelationItem`. 这个关系包括源条目, 目标条目, 和条目关系.)

然后要把对应的 item 存到数据库里, 就需要我们定义一个`pipeline`了.

最想吐槽的就是这里...

原来我已经用`aiohttp`写了一些东西, 自认为还比较熟悉异步了, 结果没想到 python 的异步库真是各自为战. `scrapy`是基于`twisted`的, 所以基于`asyncio`的异步库是不能在这里用的. 我数据库用的是`MongoDB`, 原本`mongodb`官方有一个数据库`motor`, 支持`tornado`和`asyncio`的 ioloop, 但是不支持`twisted`...

所以就算你了解 python 异步标准库的写法, 用另一个异步框架的时候还是可能一脸懵逼...

额外去找了一个`twisted`支持的 mongo 库`txmongo`, 用来存数据.

## 数据处理

爬回来的数据不处理别说别人了, 我自己都看不懂.

回到我们一开始的目的, 把有关系的条目放在一起, 显示他们之间的关系.

最后显示出来的是一个力导向图啊, 那直接用 d3.js 好了, 找一个 d3.js 的 demo 来看看他需要的数据结构是什么样的.

参考了这篇文章

[【 D3.js 进阶系列 — 2.0 】 力学图 + 人物关系图](https://blog.csdn.net/lzhlzz/article/details/40450379)

最后需要的是一个这样的数据结构

```json
{
  "nodes": [
    { "name": "云天河", "image": "tianhe.png" },
    { "name": "韩菱纱", "image": "lingsha.png" },
    { "name": "柳梦璃", "image": "mengli.png" },
    { "name": "慕容紫英", "image": "ziying.png" }
  ],
  "edges": [
    { "source": 0, "target": 1, "relation": "挚友" },
    { "source": 0, "target": 2, "relation": "挚友" },
    { "source": 0, "target": 3, "relation": "挚友" }
  ]
}
```

这正好就是我爬下来的数据的结构啊.

那就只剩下一个问题了, 怎么把同一张网节点和关系组合在一起.

本来想要直接一个 for 循环遍历, 发现这样有一个问题, 一个大的网络可能会断成好几个小的网络. 正好受到了`scrapy`爬取网站的办法, 在写一个 work 函数, 不停地把下一个需要处理的节点给`yield`出来, 然后从`yield`出来的节点不断的开始处理.

```python
def worker(start_job=None):
    yield_job = []
    done_id = set()
    if start_job is None:
        start_job = [
            x['_id'] for x in n_subject.find({}, {'_id': 1})
        ]
    while True:
        print('\r', len(yield_job) + len(start_job), end='')
        if yield_job:
            j = yield_job.pop()
            if j in done_id:
                continue
            for node in deal_with_node({'_id': j}):
                yield_job.append(node)
            done_id.add(j)
        elif start_job:
            j = start_job.pop()
            if j in done_id:
                continue
            for node in deal_with_node({'_id': j}):
                yield_job.append(node)
            done_id.add(j)
        else:
            print('done')
            break
```

其中, 用来处理节点的函数`deal_with_noed(node)`首先获取节点跟其他节点的关系, 如果某个关系(比如角色歌, op, ed 之类的)不符合需要添加的条件就跳过, 如果符合条件, 先看看有没有一个现成的网络, 有就把对应节点加入到网络里, 没有就新建一个网络, 把对应节点加进去. 然后把对应节点`yield`出去.

可以看到, 我在外面`for node in deal_with_node({'_id': j}):yield_job.append(node)`, 所以所有`yield`出来的节点都会成为下一个处理的节点. 这样一来会保证处理完一个网络只有的所有节点才会进行下一步, 处理下一个网络的节点.

这样一来, 就可以保证一个整体网络不会裂成两个网络.

## 更新

迫于用来跑这个程序的服务器只有 1C1G, 跑了一堆服务器的情况下再跑一个 Mongo 太勉强了, 再加上腾讯的学生优惠还有 36 每年的 mysql(1G 内存, 50G 硬盘), 就买了一年的 mysql 实例用来存数据, 减轻服务器的内存压力.

然后就牵扯 twisted 异步操作数据库(其实同步也不是不行, 但是如果同步存储的话数据库就会成为爬虫的瓶颈, 所以还是异步比较合适.)

twisted 提供了一个`adbapi`, 一看就知道是异步数据库 api 的意思. 操作 mysql 的话, 需要`mysqlclient`或者`pymysql`+`pymysql.install_as_MySQLdb()`跟把数据保存到 mongo 一样, 添加一个`mysqlpipeline`的 pipeline.

为了避免手写 sql, 用了`peewee`做为 orm. peewee 的每个 query 都有一个`sql()`方法, 可以不让 peewee 执行具体的操作, 而是获取对应的 sql 语句, 然后交给 twisted 的`adbpi`来执行, 避免阻塞.

`Relation`和 `Subject`是通过 peewee 定义的数据库 model.

```python
# -*- coding: utf-8 -*-

# Define your item pipelines here
#
# Don't forget to add your pipeline to the ITEM_PIPELINES setting
# See: https://doc.scrapy.org/en/latest/topics/item-pipeline.html
import pymongo

from bgm.items import SubjectItem, RelationItem
from typing import Union
from bgm.models import Subject, Relation
from twisted.enterprise import adbapi
import bgm.settings


# from playhouse.shortcuts import keyli

class MysqlPipeline(object):
    def open_spider(self, spider):
        self.dbpool = adbapi.ConnectionPool(
            "MySQLdb",
            host=bgm.settings.MYSQL_HOST,
            db=bgm.settings.MYSQL_DBNAME,
            user=bgm.settings.MYSQL_USER,
            password=bgm.settings.MYSQL_PASSWORD,
            charset='utf8mb4',
        )

    def process_item(self,
                     item: Union[SubjectItem, RelationItem],
                     spider):
        query = self.dbpool.runInteraction(self.do_insert, item)
        # 处理异常
        query.addErrback(self.handle_error, item, spider)
        return item

    def handle_error(self, failure, item, spider):
        # 处理异步插入的异常
        print(failure)

    def do_insert(self, cursor, item):
        # 会从dbpool取出cursor
        # 执行具体的插入
        if isinstance(item, SubjectItem):
            if not item['name']:
                item['name'] = item['name_cn']
            # if not item['name_cn']:
            #     item['name_cn'] = item['name']
            insert_sql = Subject.insert(
                **item
            ).on_conflict_replace().sql()
        elif isinstance(item, RelationItem):
            insert_sql = Relation.insert(
                id=f'{item["source"]}-{item["target"]}',
                **item
            ).on_conflict_replace().sql()
        else:
            return
        cursor.execute(*insert_sql)
    # 拿传进的cursor进行执行，并且自动完成commit操作
```

而在处理上, 也跟之前 mongodb 有点不一样...

之前使用 mongo 的时候, 都是直接从 mongo 里面把数据读出来, 处理完了再写会数据库.但是在使用 mysql 的时候就不太行的通了. 因为在我的使用场景下，相比 mongo, mysql 太慢了.如果把对应的关系和条目从 mysql 里读出来再处理, 有 90%的时间都花在 io 上, 而且不是一两个小时能处理完的. 所以只能选择一开始把 mysql 里的所有数据读到内存, 放在 mysql 里面处理.

而大概 20w 条条目, 20w 条条目间关系, 全都读到数据库里大概需要 1400MB 左右的内存, 我的服务器已经处理不了了, 只能先把数据库从服务器上下载下来, 然后再进行处理.

之前发在 bgm 上之后有人提议说增量更新新的条目, 正好现在已经把主要的数据爬完了, 还剩下一些旧的条目, 只要写一个额外的爬虫定期处理[bangumi wiki 计划](https://bgm.tv/wiki)页面显示的更改就好了.
