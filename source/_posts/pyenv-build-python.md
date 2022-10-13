---
title: 用pyenv安装python
date: 2019-12-23
tags:
  - python
  - linux
---

[pyenv](https://github.com/pyenv/pyenv)是用来安装多个版本的 python

<!-- more -->

官方提供了安装脚本

```console
curl https://cdn.jsdelivr.net/gh/pyenv/pyenv-installer/bin/pyenv-installer | bash
```

(用 jsdeliver 是因为 raw.githubusercontent.com 现在访问不通了)

启用 cache:

```console
mkdir -p .pyenv/cache
```

使用 ccache, 可以缓存构件中的对象

```console
git clone https://github.com/yyuu/pyenv-ccache.git $(pyenv root)/plugins/pyenv-ccache
sudo apt install ccache
```

安装过程中会出现的错误

zipimport.ZipImportError: can't decompress data; zlib not available

```console
sudo apt install zlib1g-dev
```

WARNING: The Python bz2 extension was not compiled. Missing the bzip2 lib?

```console
sudo apt install libbz2-dev
```

WARNING: The Python readline extension was not compiled. Missing the GNU readline lib?

```console
sudo apt-get install libreadline-dev
```

ERROR: The Python ssl extension was not compiled. Missing the OpenSSL lib?

```console
sudo apt install libssl-dev
```

WARNING: The Python sqlite3 extension was not compiled. Missing the SQLite3 lib?

```console
sudo apt install libsqlite3-dev
```

WARNING: The Python lzma extension was not compiled. Missing the lzma lib?

```console
sudo apt-get install liblzma-dev
```

实际使用的时候可能会报错

ModuleNotFoundError: No module named '\_ctypes'

```console
sudo apt install libffi-dev
```

跟`pyinstaller`一起使用，需要添加一个编译选项:

```bash
export PYTHON_CONFIGURE_OPTS="--enable-shared"
```

`xxenv-latest` 用来直接选中最新的版本，比如使用 3.8 来选中最新的 3.8.9 版本。

```console
git clone https://github.com/momo-lab/xxenv-latest.git "$(pyenv root)"/plugins/xxenv-latest
```
