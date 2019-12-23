---
title: caddy在内网中无法更新证书
date: 2019-12-23 15:31:10
categories:
- 编程
tags:
- https
---

最近用caddy作为家里一台服务器的https入口, 突然遇到了证书过期的问题.

一段时间之后发现是申请证书失败 `SERVFAIL for _acme-challenge.my_domain.`

大概搜索了一下, 是因为路由器的dnsmasq过滤掉了完成验证需要的dns查询

只要在dnsmasq设置中把filterwin2k参数禁用即可, 不同版本的dnsmasq禁用方法有些不同
