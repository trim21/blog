---
title: golang 结构体的内存细节
date: 2022-08-02 21:56:18
categories:
  - 编程
tags:
  - golang
---

最近用 reflect 和 unsafe 写了一个 golang 库，用于处理 php serialize 生成的二进制数据，正好了解了一些 golang 基本类型内存细节。

<!-- more -->

本文基于 go 1.18.5

## Interface

如果你看过类似的介绍的文章的话，可能知道 golang 的`interface`是通过 dynamic dispatch 来实现的。

也就是说，在运行时才从类型上找到真正的函数方法并调用。在编译期仅仅检查对应的类型是否时间了接口的全部方法。

golang `interface` 在内存中分成两种，空 `interface` （也就是 `any`） 包含类型和只有一个非常基础的类型 `*rtype` ，保存了变量的真实类型。会保存为一个结构体，包含变量的和指向变量的指针

```golang
type emptyInterface struct {
	typ  *rtype
	word unsafe.Pointer
}
```

有方法的接口会则会拥有一个更加复杂的类型，包含了这个接口的方法

```golang
type interfaceType struct {
	rtype
	pkgPath name      // import path
	methods []imethod // sorted by hash
}
```

## 非 Interface 的具体类型

非`interface`的变量是直接储存在对应的内存位置的。

如：`var v int64 = 1`

golang 提供了 `unsafe.Sizeof` 来察看变量直接占用的内存和对齐的大小。

如 `unsafe.Sizeof(int64(0))` 的值为 `8`，

一般来说，go 的结构体占用一段连续的内存空间。

```golang
type S struct {
  Int64 int64
  Bool1 bool
  Bool2 bool
}
```

这里的 `S` 在物理内存上会占用 `int64`+`bool`+`bool`+padding 长度的内存，也就是 8byte+1bit+padding。在这里为了对齐，padding 会是 7bit+7byte，跟 bool 的 1bit 凑够 8byte。

| name  |      size      |
| :---: | :------------: |
| Int64 |     8 byte     |
| Bool1 |     1 bit      |
| Bool2 |     1 bit      |
| align | 7 byte + 6 bit |

如果，你的字段类型是`slice`，`map`或者`string`这样的指针类型，占用的内存就要另外考虑了：

比如 `slice` 和 `string` 实际上是另外的两个结构体：

```golang
type SliceHeader struct {
  Data uintptr
  Len  int
  Cap  int
}
```

<https://github.com/golang/go/blob/go1.18.5/src/reflect/value.go#L2601-L2605>

```golang
type StringHeader struct {
  Data uintptr
  Len  int
}
```

<https://github.com/golang/go/blob/go1.18.5/src/reflect/value.go#L2590-L2593>

(不可修改的 `string` 类型没有 `Cap` 。)

这里的 `Data uintptr` 指向的是内存中 slice 的真实位置。
