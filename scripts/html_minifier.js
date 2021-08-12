/* global hexo:true */
"use strict";
const minify = require("html-minifier").minify;
const options = {
  removeComments: true,
  collapseWhitespace: true,
  collapseBooleanAttributes: true,
  removeEmptyAttributes: true,
  removeScriptTypeAttributes: true,
  removeStyleLinkTypeAttributes: true,
};

hexo.extend.filter.register("after_render:html", function (str) {
  return minify(str, options);
});
