/**
 * Fancybox tag
 *
 * Syntax:
 *   {% fancybox /path/to/image [/path/to/thumbnail] [title] %}
 */
const { htmlTag } = require("hexo-util");
const Url = require("url");
const { posix } = require("path");

hexo.extend.tag.register("jsdelivr", function (args) {
  let [path, title] = args;
  let { source } = this;
  if (path[0] !== "/") {
    path = posix.join(source, path);
  }
  let u = new Url.URL(`https://cdn.jsdelivr.net` + posix.join("/gh/trim21/blog", path));

  const attrs = {
    src: u.toString(),
    title,
  };

  return htmlTag("img", attrs);
});
