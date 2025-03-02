---
categories:
  - 硬件
date: "2016-08-13T21:53:02+08:00"
tags:
  - python
  - 树莓派
title: 树莓派控制步进电机
type: post
---

有一个题目需要用步进电机控制转速,而且需要控制转动特定的角度,所以找到了步进电机这种东西来拍照.

<!--more-->

步进电机内部是通过不同线圈分别通上不同方向的电流,按顺序通一定的电流,就可以让电机转动一个特定的角度.

之前我以为在转动的时候会一颤一颤的,非常明显的进动,但是实际使用发现并不是这样,实际上上一次转动的角度是非常小的,所以并没有非常的明显的卡顿感.

我用的电机可以看出来一共有 5 根线,一根正极,其他四根分别接驱动板的四个信号输出端.然后用树莓派的 GPIO 分别输出信号给驱动板.驱动板对相应信号作出反应,会输出相应的电压.

驱动板我用的是 L298N,这个板子在淘宝店上有好几家店卖具体样子不同的产品,这个板子上面有四个**使能**,这词我琢磨了半天没懂,后来才发现是`enable`...所以其实就是在通上 5V 的电压之后就可以用单片机控制电压输出与否了.

我买的板子上的使能是用跳线做为使能的,就是用跳线短接的时候就已经使能了.

但是我傻傻的吧 gpio 接上去了,问题就出来了.....我眼看着我的树莓派的灯越来越暗,然后树莓派被烧了.

其实就是把跳线短接就已经使能了.这个时候把树莓派的 gpio 口输出接到驱动板的 in 口就可以控制了.

当时用的程序,这个程序是控制了我的电机旋转了接近 180°.

python3

```python
import RPi.GPIO as io
import time
io.setmode(io.BOARD)

out1=12
out2=16
out3=18
out4=22s

if __name__ == '__main__':
    # Setup leds
    io.setup(out1,io.OUT)
    io.output(out1,0)
    io.setup(out2,io.OUT)
    io.output(out2,0)
    io.setup(out3,io.OUT)
    io.output(out3,0)
    io.setup(out4,io.OUT)
    io.output(out4,0)
    # Run blinking forever
    try:
        while True:
            io.output(out1,1)
            time.sleep(0.3)
            io.output(out4,0)
            time.sleep(0.3)
            io.output(out2,1)
            time.sleep(0.3)
            io.output(out1,0)
            time.sleep(0.3)
            io.output(out3,1)
            time.sleep(0.3)
            io.output(out2,0)
            time.sleep(0.3)
            io.output(out4,1)
            time.sleep(0.3)
            io.output(out3,0)
            time.sleep(0.3)
    # Stop on Ctrl+C and clean up
    except KeyboardInterrupt:
        io.cleanup()
```
