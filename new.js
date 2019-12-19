const Hexo = require('hexo');
const hexo = new Hexo();

hexo.init().then(function () {
  hexo.post.create({
    slug: process.argv.slice(2).join('-'),
    title: process.argv.slice(2).join(' '),
    tags: null,
  }, false);
});
