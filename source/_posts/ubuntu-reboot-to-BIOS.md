---
title: ubuntu使用命令重启进入BIOS
date: 2017-05-19 02:20:20
tags:
  - ubuntu
---

今天一不小心开了 BIOS 里的快速启动,导致进不去 BIOS 设置也无法选择启动项(我还把 ubuntu 设置成了第一启动项...)百度搜索无果,google 发现了结果

```bash
sudo systemctl reboot --firmware-setup
```

会直接重启进入 BIOS
