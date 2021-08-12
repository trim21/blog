---
title: 国内服务器安装K8S
date: 2019-06-30 04:42:55
tags:
  - k8s
---

之前只用过 docker，到现在所有跑在服务器上的程序基本都在用 docker 跑了，但是一直都没用过 k8s，虽然尝试了几下，但是总是因为 gfw 的问题没法完整的安装。

今天终于成功在腾讯云的服务器上完整的安装了 K8S.全程没有挂代理

<!-- more -->

我使用的服务器是两台 ubuntu18.04 和一台 16.04, master 的节点在 18.04 上.

安装 k8s 主要有两个地方需要挂代理

1. apt 源需要代理
2. 用到的 docker 镜像 register 需要代理

不过幸好这两个分别在国内都有镜像.

## 事前准备

有两点需要注意

1. k8s 目前还不支持 swap,所以需要用`sudo swapoff -a`来关闭 swap
2. docker 的`cgroup`默认是`cgroupfs`,`kubeadm`推荐设置为`systemd`.这一点可以设置`/etc/docker/daemon.json`

如果你没有设置过`daemon.json`的话,可以直接用这个命令来设置.

```bash
echo '{
  "exec-opts": ["native.cgroupdriver=systemd"],
  "registry-mirrors": [
    "https://mirror.ccs.tencentyun.com"
  ]
}' | sudo tee /etc/docker/daemon.json
```

因为我使用的是腾讯云的机器,所以设置了`registry-mirrors`为腾讯云, 如果你不需要或者使用的是其他的云服务器可以设置为其他的镜像或者不设置这一项

然后使用`sudo service docker restart`来重启 docker 让设置生效.

## 安装 k8s 本身

k8s 本身包括`kubelet`和`kubectl`,我还额外安装了`kubeadm`.

apt 源可以使用阿里或者中科大,或者腾讯云的镜像,不过腾讯云的镜像我在安装的时候出现了索引跟跟具体文件不符的问题,而中科大的源没有同步 yum 仓库和 gpg 证书,所以我使用了阿里的源.

(当然,手动从别的源添加证书,然后使用中科大的 apt 源也是可行的,我起初安装的时候就是这么办的)

```bash
#!/usr/bin/env bash
#set -e

MIRROR_ROOT="https://mirrors.aliyun.com"

curl -s "${MIRROR_ROOT}/kubernetes/apt/dists/kubernetes-xenial/Release.gpg"\
| sudo apt-key add -

sudo echo "deb $MIRROR_ROOT/kubernetes/apt/ kubernetes-xenial main" \
| sudo tee /etc/apt/sources.list.d/kubernetes.list

sudo apt-get update
sudo apt-get install -y kubelet kubeadm kubectl
sudo apt-mark hold kubelet kubeadm kubectl
```

首先安装 k8s 的 gpg 证书,添加 k8s 的仓库,然后安装`kubelet`,`kubeadm`和`kubectl`.

## 拉取 docker 镜像

默认 k8s 会从`k8s.gcr.io`拉取镜像,但是不幸的是这个地址也被墙了.

但是 docker 是可以从别的地方拉取镜像,然后随意给镜像打 tag 的(比如我可以把一个 python2 的镜像打上 python3 的 tag,然后然后所有在这台机器上构建的`FROM:python3`都会被成功坑到)

```bash
#!/usr/bin/env bash
KUBE_VERSION=${KUBE_VERSION:=1.15.0}

images=(`kubeadm config images list --kubernetes-version=$KUBE_VERSION`)

for imageName in ${images[@]} ; do
#    echo "$imageName"
    image=${imageName/k8s.gcr.io\//}
    docker pull registry.cn-hangzhou.aliyuncs.com/google_containers/$image
    docker tag registry.cn-hangzhou.aliyuncs.com/google_containers/$image k8s.gcr.io/$image
done
```

`KUBE_VERSION=${KUBE_VERSION:=1.15.0}`的含义是如果设置了`KUBE_VERSION`变量或者环境变量,就使用设置的值.如果没有,就使用`1.15.0`做为默认值.

kubeadm 如果不指定版本的话,会默认使用最新的版本,也可以指定为旧版本.

`kubeadm config images list`在国内环境下默认会有一个警告,但是仍然可以列出我们需要拉取的镜像.默认的镜像名有`k8s.gcr.io`前缀,用 bash 的字符串替换语法去掉,使用`docker pull`从国内镜像拉取镜像,然后给相应的镜像打上对应`k8s`的 tag. 前期准备就算是都完成了.

## 启动 k8s 集群

如果下面的`kubeadm`命令运行失败提示权限不足,需要使用`sudo`来运行.

### 启动 master

我使用的是`kubeadm`来管理的 k8s. 启动 master 使用的是`kubeadm init`命令

```bash
KUBE_VERSION=${KUBE_VERSION:=1.15.0}

IP="your IP"

sudo kubeadm init --kubernetes-version=v$KUBE_VERSION \
        --apiserver-advertise-address $IP | tee ~/kubeadm.init.log
```

其中,`KUBE_VERSION`跟前文一样,kubeadm 需要指定一个版本,不如就会从被墙掉的网址试图获取最新的 k8s 版本.由于网络问题又无法获取到,所以手动指定版本. 而`--apiserver-advertise-address`参数在后面让 node 加入集群的时候会用到.因为我所有的机器都在腾讯云同一个内网中,所以直接使用了内网 ip.如果你的机器之间只能使用公网互联,则需要使用公网 ip.

如果中间遇到了什么问题,需要重新初始化的话,需要使用`kubeadm reset`命令来重置之前的设置.然后重新使用`kubeadm init`命令来初始化. 或者懒得 reset,直接加上`-preflight-errors=all`参数忽略前期准备也行.

在 master 节点初始化成功后,会看到 kubeadm 的提示, 可以使用`kubectl get nodes`来查看,会显示一个 master 节点.

### 添加节点

在节点机器上同样 master 节点一样安装 k8s.然后查看 master 节点初始化的 log(master 节点上的`~/kubeadm.init.log`),里面有一个关于 node 如何加入集群的提示.类似于这样

```bash
kubeadm join $IP:$PORT --token *****.********** \
    --discovery-token-ca-cert-hash sha256:**********
```

放通主机和客户端上的`6443`,`10250`端口,然后在节点机器上运行这一命令(可能需要`sudo`), 在命令成功之后在 master 节点运行`kubectl get nodes`,应该可以看到有新机器加入节点.

节点就成功加入了集群.

## 其它问题

使用`kubectl get pods --all-namespaces`可以查看所有 pods 的状态,用来提供 dns 服务的`coredns`一直处于`pending`状态,查了查相关问题是因为我的 k8s 还没有设置`network-policy`.我使用了[`weave`](https://github.com/weaveworks/weave)

在 master 节点上使用 kubectl 给集群安装新东西.

```bash
kubectl apply -f https://github.com/weaveworks/weave/releases/download/latest_release/weave-daemonset-k8s-1.8.yaml
```

等待一段时间再次运行`kubectl get pods --all-namespaces`,应该就可以看到`weave`和`coredns`都变成了`Running`的状态.
