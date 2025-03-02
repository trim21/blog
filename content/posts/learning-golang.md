---
title: golang笔记
date: 2018-11-01 17:25:15
update: 2018-11-01 17:25:15
tags:
  - golang
---

## 一些约定

1. 使用驼峰命名法
2. 首字母小写的变量/函数只能在包内使用(多按一次 shift 我要累死了, 虽然编辑器有时在小写输入的情况下也会自动补全大写内容, 但有时不是那么聪明)

<!-- more -->

## 数据类型

### bool

布尔, `true`或者`false`

### string

字符串, 使用双引号 比如`"hello world"`

### rune

类似于字符, 在使用`for _, char := range string`迭代 string 的时候, char 的类型就是 rune

### int

未分 int8, int16, int32 等等, 可能有些 api 返回的是 uint 类型, 使用`int()`转化为 int

### byte

`[]byte`可以跟 string 互相转化, `len(string)`的长度实际上就是 string 转化为`[]byte`之后的长度. 每个 unicode 的长度为 3. 比如说`len("hello world")==11`, 但是`len("你好 世界")`的长度为 3+3+1=7. 每个汉字因为是 unicode 所以为 3.

### 指针

可以指向其他数据类型, 在传值的时候传递指针可以避免比较复杂的数据结构被复制一份.(比如比较大的数据, 结构体等等)

### 数组

用于存放类型相同的一组数据.

#### slice

可变长度

#### array

长度不可变

### map

类似于 python 中的 dict, 但是需要指定 key 和 value 的类型

比如 python 中的`Map[str, str]`在 golang 中为`map[string]string`, 这个 map 只能以 string 为 key, 以 string 为 value.

如果要一个可以存储任意数据类型的 map 可以`map[string]interface{}`

### 函数

```golang
func main(arg1 argType1, arg2 argType2) (returnType1, returnType2){
    main body
}
```

golang 中, 变量的类型是放在变量名之后的.

### struct

结构体, 类似于 python 中的 class.

#### 定义

```golang
type Episode struct {
    Title   string
    Torrent string
    Episode int
    Time    int
}
```

#### 初始化

使用大括号

```golang
var e = Episode{
    Title:   "hello world",
    Episode: 1,
}
```

#### 结构体的方法

如果要在其上绑定函数, 使用

```golang
func (episode *Episode) getTitle() string {
    return episode.Title
}
```

条用跟其他语言的调用方法类似.

```golang
e.getTitle()
```

### 接口 interface

还没有实际用到, 所以只有一些粗浅的理解.

interface 接口是为了面向对象而出现的, 一个函数可以参数可以为一系列不特定的类型, 但无所谓具体的类型, 只要这个类型实现了特定的方法即可.

比如一个`writeTo`函数接受一个`io.Writer`的参数

```golang
func writeTo(w io.Writer) error {

}
```

```golang
// io.Writer
type Writer interface {
    Write(p []byte) (n int, err error)
}
```

只要是实现了`Write`方法的, 输入值和返回值匹配`([]byte) (int, error)`类型都可以做为这个函数的参数. 比如说默认的标准库`os`提供的`os.Stdout`就是一个实现了`io.Writer`接口的类型. 比如说, 这里就可以以`writeTo(os.Stdout)`的形式调用.

### channel

信道

go 并发中, 不同`goroutine`的通信工具.

无缓冲区或者缓冲区已满的情况下进行写入是阻塞的.

如果信道为空, 而试图读取也会阻塞.

只有读取没有写入或者只有写入没有读取会导致死锁.

## 并发编程

golang 提供了`go`关键词来开启一个`goroutine`.

因为 goroutine 函数的返回值是会被丢弃的, 使用回调函数的话又会陷入回调地域中, 所以需要一种额外的方式来接受异步函数的返回结果.

这里就要贴出那句 go 并发文章常常能看到的话了

> 不要通过共享内存来通信，而应该通过通信来共享内存

而`channel`, 就是 go 提供的通信的工具. 可以在一个线程中发送数据, 在另一个线程中接收数据. 如果我们要写一个异步爬虫, 就可以开四个线程来爬取数据, 在爬到数据后通过 channel 发送到主线程, 然后在主线程中使用 channel 接受, 交给 pipeline 来处理.

```golang
package main

import (
    "fmt"
)

func costumer(c chan int) {
    for each := range c {
        fmt.Printf("costume %d\n", each)
    }
}

func main() {
    fmt.Println("hello world")
    var c = make(chan int)
    go costumer(c)
    for index := 0; index < 5; index++ {
        c <- index
    }
}
```

使用`go costumer(channel)`启动了一个新的消费者线程, 而主线程自己也是一个`goroutine`, 虽然跟`costumer`不在同一个线程中, 但是仍然可以通过 channel 通信, 在这里, 主线程就是生产者, 消费者模型中的生产者.

### 并发控制

有时候并不需要很大的并发量, 比如我们只想起 4 个或者 8 个生产者, 可以使用`sync.WaitGroup`来进行并发控制.

```golang
package main

import (
    "fmt"
    "sync"
)

func main() {
    var controller = newController(4)

    var urls = []string{}

    for index := 0; index < 20; index++ {
        urls = append(urls, fmt.Sprintf("%d", index))
    }

    go controller.dispatchGocoutine(urls)

    for each := range controller.output {
        fmt.Println("collect output " + each)
    }
}

type asyncControl struct {
    wrg       sync.WaitGroup
    output     chan string
    goroutineCnt chan int
}

// newController
func newController(size int) *asyncControl {
    d := new(asyncControl)
    d.wrg = sync.WaitGroup{}
    d.output = make(chan string)
    d.goroutineCnt = make(chan int, size)
    return d
}
func (controller *asyncControl) dispatchGocoutine(urls []string) {
    for _, url := range urls {
        controller.goroutineCnt <- 0 // 限制线程数
        controller.wrg.Add(1)
        go controller.asyncTask(url)
    }
    controller.wrg.Wait() // 等待至所有分发出去的线程结束
    close(controller.output)
}

func (controller *asyncControl) asyncTask(url string) {
    defer func() {
        <-controller.goroutineCnt
        controller.wrg.Done()
    }()
    // some task here
    controller.output <- "processed " + url
}
```

因为提到在缓冲区已满的情况下写入是阻塞的, 所以可以利用这一点来进行并发控制. `goroutineCnt`就是用来控制最大线程数的任务. 当我们试图开启一个新的线程的时候, 先向`goroutineCnt`中进行一次写入, 再开启一个新的任务. 而在工作进程中, 在整个函数执行完成后则从`goroutineCnt`中进行一次读取. 缓冲区就会空出一位来, 而进行工作分发的线程的阻塞此时就结束了, 在成功写入信道之后则会开启一个新的线程. 保持工作线程数量永远不会超过`goroutineCnt`的缓冲区长度.

这个`sync.WaitGroup`是另一个并发的工具, 因为不能确定其他 goroutine 什么时候才能结束, 所以使用`wrk.Wait()`来在分发结束后阻塞分发的线程, 在所有分发出去的线程结束后关闭信道.
