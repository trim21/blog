---
title: bash和zsh的自动补全
date: 2017-12-09 09:58:46
categories:
  - 编程
tags:
  - shell
---

最近在给一个开源项目贡献代码,想要给他加上相应的自动补全功能

[BGmi](https://github.com/BGmi/BGmi)起初只是个 cli 程序,前端单纯的展示已经下载的剧集,后来给前端加了一些订阅功能,但是 cli 的使用频率还是很高,cli 没有自动补全功能总是说不过去,所以就花了一些时间加上了这个功能.

<!-- more -->

## 分析一下需求

BGmi 的命令都是同样的结构,`bgmi action1 --opt1 arg1 --opt2 arg2`,那么我们需要补全的就是所有的 action 和每个 action 相应的选项了.在此之前,是直接`add_parser`和`add_argument`相应的 action 和选项.这样是没法进行下一步的,所以首先花了一些时间,所以首先把所有的`action`和相应的`opts`存在了一个变量中

```python
actions_and_arguments = [
    {
        'action': ACTION_ADD,
        'help': 'Subscribe bangumi.',
        'arguments': [
            {'dest': 'name',
             'kwargs': dict(metavar='name', type=unicode_, nargs='+',
                            help='Bangumi name'), },
            {'dest': '--episode',
             'kwargs': dict(metavar='episode',
                            help='Add bangumi and mark it as specified episode.',
                            type=int), },
        ]
    },
    {
        'action': ACTION_DELETE,
        'help': 'Unsubscribe bangumi.',
        'arguments': [
            {'dest': '--name',
             'kwargs': dict(metavar='name', nargs='+', type=unicode_,
                            help='Bangumi name to unsubscribe.'), },
            {'dest': '--batch',
             'kwargs': dict(action='store_true', help='No confirmation.'), },
        ]
    }]
```

一个`list`中储存了多个`dict`,每个`dict`对应一个`action`,每个`action`的选项存在`arguments`字段中.这里的命名可能有些混乱,写的时候没太注意.

无论是在 bash 还是 zsh 中,要让 bgmi 有自动补全的功能,都需要一个相应的函数来给 bgmi 命令提供自动补全功能,也就是说,我们是要把上面的一个`dict`转换成一个字符串. 这种事情,当然就该模板出马了.因为 BGmi 的 api 是由 tornado 提供的,所以就直接用`tornado.template`了.

## 先从 Bash 的自动补全开始

参考的[跟我一起写 shell 补全脚本（Bash 篇）](https://segmentfault.com/a/1190000002968878)

最终的模板[\_bgmi_completion_bash.sh](https://github.com/BGmi/BGmi/blob/0b21db0148f1794219c96520151933904f2918cf/bgmi/others/_bgmi_completion_bash.sh)

### 先说下 bash 的语法

基本上会用到的数据类型就是字符串和数字了,字符串两边需要加单引号的双引号,或者是反引号.而单引号和双引号还有一些不同.双引号允许转义,而单引号不允许

shell 的语法跟编程语言的语法有一些不同,感觉 shell 的语法在故意混淆字符串和命令.语句中的一个单词又可以做为命令又可以做为字符串.所以为了避免歧义,需要加上单引号或者双引号.而单引号和双引号又有一些不同.单引号是没有转义的,双引号是有转义的.比如说

```bash
export var=1
echo "$var" # 1
echo "$var 233" # 1 233
echo '$var' # $var
echo "`ls`" # 输出ls命令的输出
```

在双引号字符串中,以`$`开头的会被替换成对应的变量,用反引号包起来的内容会视为命令,运行之后把输出替换为字符串的一部分

### 然后是具体的代码

bash 用来提供自动补全的命令是`complete`

```bash
complete --help
complete: complete [-abcdefgjksuv] [-pr] [-DE] [-o option] [-A action]
[-G globpat] [-W wordlist] [-F function] [-C command] [-X filterpat]
[-P prefix] [-S suffix] [name ...]
    Specify how arguments are to be completed by Readline.

    For each NAME, specify how arguments are to be completed.  If no options
    are supplied, existing completion specifications are printed in a way that
    allows them to be reused as input.

    Options:
      -p        print existing completion specifications in a reusable format
      -r        remove a completion specification for each NAME, or, if no
                NAMEs are supplied, all completion specifications
      -D        apply the completions and actions as the default for commands
                without any specific completion defined
      -E        apply the completions and actions to "empty" commands --
                completion attempted on a blank line

    When completion is attempted, the actions are applied in the order the
    uppercase-letter options are listed above.  The -D option takes
    precedence over -E.

    Exit Status:
    Returns success unless an invalid option is supplied or an error occurs.
```

本来`complete`是支持用另一个命令来进行自动补全的,但是试了试实在是太慢了,所以还是生成了一个 bash 函数.

因为我是编写了一个`_bgmi`函数来进行`bgmi`命令的自动补全,所以此处就应该`complete -F _bgmi bgmi`

然后就是`_bgmi`函数本体了. config 太多,只贴了一部分.

```bash
_bgmi() {
    local pre cur action
    local actions bangumi config
    actions="add delete update cal config filter fetch download list mark search source complete"
    config="BANGUMI_MOE_URL SAVE_PATH DOWNLOAD_DELEGATE MAX_PAGE TMP_PATH DANMAKU_API_URL"
    COMPREPLY=()

    pre=${COMP_WORDS[COMP_CWORD-1]}
    cur=${COMP_WORDS[COMP_CWORD]}
    if [ $COMP_CWORD -eq 1 ]; then
        COMPREPLY=( $( compgen -W "$actions" -- $cur ) )
    else
        action=${COMP_WORDS[1]}

        case "$action" in

            update )
            local opts
            opts="--download -d --not-ignore"
            COMPREPLY=( $( compgen -W "$opts" -- $cur ) )
            return 0
            ;;

            filter )
            local opts
            opts="--subtitle --include --exclude --regex"
            COMPREPLY=( $( compgen -W "$opts" -- $cur ) )
            return 0
            ;;

            config )
            COMPREPLY=( $( compgen -W "$config" -- $cur ) )
            return 0
            ;;

            cal )
            local opts
            opts="--today -f --force-update --download-cover --no-save"
            COMPREPLY=( $( compgen -W "$opts" -- $cur ) )
            return 0
            ;;

            source )
            local source
            source="bangumi_moe mikan_project dmhy"
            COMPREPLY=( $( compgen -W "$source" -- $cur ) )
            return 0
            ;;

            search )
            local opts
            opts="--count --regex-filter --download --dupe"
            COMPREPLY=( $( compgen -W "$opts" -- $cur ) )
            return 0
            ;;

            download )
            local opts
            opts="--list --mark --status"
            COMPREPLY=( $( compgen -W "$opts" -- $cur ) )
            return 0
            ;;

        esac

    fi

}
complete -F _bgmi bgmi

# run `eval "$(bgmi complete)"` in your bash
```

`COMP_WORDS`是保存了当前命令行所有输入内容的一个数组,`COMP_CWORD`是当前正在输入的词的索引.
所以,`pre=${COMP_WORDS[COMP_CWORD-1]}`是当前正在输入的前一个词,`cur=${COMP_WORDS[COMP_CWORD]}`是正在输入的词.

(这里用`${}`包起来跟直接使用`$var`没有什么区别,只是其他语言的变量前不用加`$`,用`{}`包起来个人看起来习惯一点.)

因为`bgmi`的命令都是`bgmi action args`这样的形式,所以先判断`COMP_WORDS`的大小,如果等于 1,说明还没输出对应的 action,需要补全 action. 如果大于 1, 说明已经输入过了 action,只需要补全对应的选项.

在 bash 中,生成对应补全选项的命令是`compgen`

```bash
$ compgen --help
compgen: compgen [-abcdefgjksuv] [-o option] [-A action]
 [-G globpat] [-W wordlist]  [-F function] [-C command]
 [-X filterpat] [-P prefix] [-S suffix] [word]

    Display possible completions depending on the options.

    Intended to be used from within a shell function generating possible
    completions.  If the optional WORD argument is supplied, matches against
    WORD are generated.

    Exit Status:
    Returns success unless an invalid option is supplied or an error occurs.
```

我在这里只用到了`compgen -W` 根据一个`wordlist`来生成对应的补全.

接下来只需要把对应的内容根据模板的要求进行修改就可以了.

## Zsh 的自动补全

参照的这篇文章[https://github.com/spacewander/blogWithMarkdown/issues/32](https://github.com/spacewander/blogWithMarkdown/issues/32)

先放个结果...

```zsh
_bgmi(){

    if [[ ${#words} -le 2 ]]
            then
        _alternative \
            'action:action options:((add\:"Subscribe bangumi." delete\:"Unsubscribe bangumi." list\:"List subscribed bangumi." filter\:"Set bangumi fetch filter." update\:"Update bangumi calendar and subscribed bangumi episode." cal\:"Print bangumi calendar." config\:"Config BGmi." mark\:"Mark bangumi episode." download\:"Download manager." fetch\:"Fetch bangumi." search\:"Search torrents from data source by keyword" source\:"Select date source bangumi_moe or mikan_project" install\:"Install BGmi front / admin / download delegate" upgrade\:"Check update." history\:"List your history of following bangumi" ))'
    fi

    if [[ ${words[(i)cal]} -le ${#words} ]]
        then
        _alternative \
        'cal:cal options:((--today\:"Show bangumi calendar for today." -f\:"Get the newest bangumi calendar from bangumi.moe." --force-update\:"Get the newest bangumi calendar from bangumi.moe." --download-cover\:"Download the cover to local" --no-save\:"Do not save the bangumi data when force update." ))'
    fi

}

compdef _bgmi bgmi

#usage: eval "$(bgmi complete)"
#if you are using windows, cygwin or babun, try `eval "$(bgmi complete|dos2unix)"`
```

zsh 跟 bash 有几点不同

bash 中的 complete 在 zsh 中是 compdef

zsh 中用来保存目前所有输入的词组是`words`

zsh 中要生成对应的提醒的话用的是`_alternative`等命令,而不是把结果赋值给某个变量.

其中有这样一个用法

`${words[(i)cal]}` 这类似于 js 中的`words.indexOf('cal')` 而`#a`就相当于`a.length`

因为`_alternative`的功能是最全的,所以我就只用了`_alternative`这一个命令
`cal:cal options:(( -f\:"Get the newest bangumi calendar from bangumi.moe." --force-update\:"Get the newest bangumi calendar from bangumi.moe." ))`

如果有两个选项是同样的意思,直接重复输出就可以了,zsh 会自动把他们合并成一行,就像这样 其中 `--force-update`和`-f`的帮助信息在我们输入的时候就是相同的.

```zsh
ubuntu@VM-189-243-ubuntu ~ $ bgmi cal -
--download-cover      -- Download the cover to local
--force-update    -f  -- Get the newest bangumi calendar from bangumi.moe.
--no-save             -- Do not save the bangumi data when force update.
--today               -- Show bangumi calendar for today.
```
