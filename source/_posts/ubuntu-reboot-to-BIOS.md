---
updated: 2017-05-19 02:20:20
title: ubuntu使用命令重启进入BIOS
date: 2017-05-19 02:20:20
tags:
- ubuntu
---

今天一不小心开了BIOS里的快速启动,导致进不去BIOS设置也无法选择启动项(我还把ubuntu设置成了第一启动项...)百度搜索无果,google发现了结果

```bash
sudo systemctl reboot --firmware-setup
```

会直接重启进入BIOS
