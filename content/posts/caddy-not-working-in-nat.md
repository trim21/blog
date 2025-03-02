---
title: caddy在内网中无法更新证书
date: 2019-12-23 15:31:10
updated: 2019-12-23
categories:
  - 编程
tags:
  - https
---

NAS 上面运行了一个 caddy 服务器，还设置了 https。最近突然遇到了证书过期的问题.

检查 log 发现是证书申请失败 `SERVFAIL for _acme-challenge.my_domain.`

大概搜索了一下, 是因为路由器的 dnsmasq 过滤掉了完成验证需要的 dns 查询

只要在 dnsmasq 设置中把 filterwin2k 参数禁用即可, 不同版本的 dnsmasq 禁用方法有些不同
