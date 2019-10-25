---
title: 给某个python爬虫添加了多线程支持
date: 2016-08-24 13:29:07
updated: 2016-08-24 13:29:07
categories:
- 编程
tags:
- python
---

本身是一个单线程的漫画爬虫, 为了不大改代码而加速, 用了选了最简单的线程池的办法.

基础的分析代码和下载代码都已经写好了,只改写了一下原本的单线程主循环

```python
from multiprocessing.pool import ThreadPool


def main(ref_box, download_range):
    jobs = list()
    for x in range(1, total_page + 1):
        jobs.append([args1, args2, args])
    pool_size=2  # 工作线程数
    pool=ThreadPool(processes = pool_size)
    pool.map(work_thread, jobs)
    pool.close()
    pool.join()


def work_thread(args):
    args1, args2, args3=args
    # do something
```

python3的代码，用的`multiprocessing`库里面的pool，爬虫里面主要时间卡在网络io上，所以直接用了几个线程没用进程。
`pool.size`是工作线程数,这地方还是不要写太多,可能请求太多被服务器那边ban掉.
`pool.map`会调用第一个参数传递的函数。把第第二个参数列表里面的每一项分别作为参数传递给函数。这里为了偷懒就直接把三个参数打包穿进去，进去再解包。

直接把原来同步的单线程代码用函数包一下喂给`pool`就好了.
