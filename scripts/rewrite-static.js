const iterator = require("markdown-it-for-inline");
const _ = require("lodash");
const { posix } = require("path");

hexo.extend.filter.register("markdown-it:renderer", function (md) {
  md.use(iterator, "foo_replace", "image", function (tokens, idx) {
    const token = tokens[idx];
    const src = _.find(token.attrs, function (attr) {
      return attr[0] === "src";
    });

    if (src[1].startsWith("http://") || src[1].startsWith("https://")) {
      console.log(src[1]);
      return;
    }
    let path = src[1];
    const origin = path;
    if (posix.isAbsolute(path)) {
      console.log(path);
      path = posix.join("/source/_posts/md", path);
    }

    src[1] = `https://cdn.jsdelivr.net` + posix.join("/gh/trim21/blog/source/", src[1]);
  });
});
