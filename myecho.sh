#!/usr/bin/env bash
echo "  repository: https://${token}@github.com/Trim21/trim21.github.io" >> ./_config.yml

./node_modules/.bin/hexo g
find ./public/ -type f -name *.html -exec ./node_modules/.bin/html-beautify --config beauty_config.json -w 120 {} -r \;
find ./public/ -type f -name *.js -exec ./node_modules/.bin/js-beautify --config beauty_config.json -w 120 {} -r \;
./node_modules/.bin/hexo d