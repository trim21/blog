---
title: 基于aioredis的redis读写锁
date: 2019-03-29 22:15:13
categories:
- 编程
tags:
- rwlock
- asyncio
- python
- redis
---

因为上了aiohttp的贼船, 所以各种数据库链接都要使用asyncio的. redis客户端选择的是[aioredis](https://github.com/aio-libs/aioredis)

目前有两个类似的项目, 一个是[aiorwlock](https://github.com/aio-libs/aiorwlock), 一个是[redisrwlock](https://github.com/veshboo/redisrwlock), 所以现在的情况是用异步的读写锁, 有用redis的读写锁, 但没有我需要的异步的redis读写锁. 所以需要自己实现一个.

## 读写锁的特点

1. 在写锁未被锁定的时候才能获取读锁
2. 在读锁未被锁定的时候才能获取写锁
3. 在速锁被获取到的情况下, 仍然可以获取读锁
4. 在写锁被锁定的情况下, 不能再获取写锁
