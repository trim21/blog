---
updated: 2017-05-26 11:39:13
title: git删除submodule
date: 2017-05-26 11:39:13
categories:
- 编程
tags:
- git
---

需要按这个顺序来，不然会出事，就得重来一遍。

```bash
git submodule deinit themes/NexT/
git rm themes/NexT/
```

慎用`git push -f`,如果推了一个其他的repo上去会造成已经clone下来的项目没法pull.
`fatal: refusing to merge unrelated histories`
