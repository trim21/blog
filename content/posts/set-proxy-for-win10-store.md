---
categories:
  - 编程
date: "2019-06-26T21:32:31+08:00"
tags:
  - python
  - windows
title: 给win10应用商店设置代理
type: post
update: 2019-06-26 21:32:31
---

最近网络状况实在是不好,用 win10 应用商店下载应用怎么也不成功.修改系统代理也不管用.
参照[少数派的这篇文章](https://sspai.com/post/41137)设置了代理,总算是解决了问题.

<!-- more -->

其中,最麻烦的是找到对应 uwp 应用的 sid,因为是要在表里一项一项的去找.

win10 商店对应的应用在注册表中的`DisplayName`是`Microsoft.WindowsStore`,
所以遍历`HKEY_CURRENT_USER\Software\Classes\Local Settings\Software\Microsoft\Windows\CurrentVersion\AppContainer\Mappings`的所有子 key,找到对应`DisplayName`中包含`Microsoft.WindowsStore`的一项就可以了.

因为手动一项一项的去找效率实在是太低,就直接写了个 python 脚本来遍历.

```python
import winreg


def iterkeys(key):
    # 获取该键的所有子键，因为没有方法可以获取子键的个数，所以只能用这种方法进行遍历
    try:
        i = 0
        while True:
            # EnumValue方法用来枚举键值，EnumKey用来枚举子键
            yield winreg.EnumKey(key, i)
            i += 1
    except WindowsError:
        return


def itervalues(key):
    # 获取该键的所有键值，因为没有方法可以获取键值的个数，所以只能用这种方法进行遍历
    d = {}
    try:
        i = 0
        while True:
            # EnumValue方法用来枚举键值，EnumKey用来枚举子键
            name, value, _ = winreg.EnumValue(key, i)
            d[name] = value
            i += 1
    except WindowsError:
        return d


def main():
    base_key = (
        r"Software\Classes\Local Settings\Software"
        r"\Microsoft\Windows\CurrentVersion\AppContainer\Mappings\\"
    )
    mappings = winreg.OpenKey(winreg.HKEY_CURRENT_USER, base_key)
    for key in iterkeys(mappings):
        k = winreg.OpenKey(winreg.HKEY_CURRENT_USER, base_key + key)
        info = itervalues(k)
        if 'WindowsStore' in info['DisplayName']:
            print(info['DisplayName'])
            print(key)
            break


if __name__ == '__main__':
    main()
```

直接保存成 py 文件,然后运行,控制台的第二行会输出类似`S-1-15-2-****`的一个 SID,就是在`CheckNetIsolation.exe loopbackexempt -a -p=${SID}`中要用到的 SID.

这之后,设置系统代理,重启 win10 商店,就能通过代理下载应用了.
