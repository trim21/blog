var Hexo = require('hexo');
var hexo = new Hexo(process.cwd(), {});

hexo.init().then(function () {
    hexo.post.create({
        slug: process.argv.slice(2).join('-'),
        title: process.argv.slice(2).join(' '),
        tags: null,
    }, false);
});
