/* global hexo */
const RAW = `# These rules will change if you change your site’s custom domains or HTTPS settings

# Redirect default Netlify subdomain to primary domain
https://trim21-blog.netlify.com/* https://blog.trim21.cn/:splat 301!`

hexo.extend.generator.register(function (locals) {
  return {
    path: '_redirects',
    data: RAW
  }
})
