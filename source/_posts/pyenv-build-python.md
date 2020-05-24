---
title: 用pyenv安装python
date: 2019-12-23
tags:
- nas
---

[pyenv](https://github.com/pyenv/pyenv)是用来安装多个版本的python

<!-- more -->

官方提供了安装脚本

```bash
curl https://cdn.jsdelivr.net/gh/pyenv/pyenv-installer/bin/pyenv-installer | bash
```

(用jsdeliver是因为raw.githubusercontent.com现在访问不通了)

启用cache:

```bash
mkdir -p .pyenv/cache
```

使用ccache, 可以缓存构件中的对象

```bash
git clone https://github.com/yyuu/pyenv-ccache.git $(pyenv root)/plugins/pyenv-ccache
sudo apt install ccache
```

安装过程中会出现的错误

zipimport.ZipImportError: can't decompress data; zlib not available

```bash
sudo apt install zlib1g-dev
```

WARNING: The Python bz2 extension was not compiled. Missing the bzip2 lib?
```bash
sudo apt insatll libbz2-dev
```

WARNING: The Python readline extension was not compiled. Missing the GNU readline lib?
```bash
sudo apt-get install libreadline-dev
```

ERROR: The Python ssl extension was not compiled. Missing the OpenSSL lib?

```bash
sudo apt install libssl-dev
```

WARNING: The Python sqlite3 extension was not compiled. Missing the SQLite3 lib?

```bash
sudo apt install libsqlite3-dev
```

实际使用的时候可能会报错

ModuleNotFoundError: No module named '_ctypes'

```bash
sudo apt install libffi-dev
```

跟`pyinstaller`一起使用，需要添加一个编译选项:

```bash
export PYTHON_CONFIGURE_OPTS="--enable-shared"
```
