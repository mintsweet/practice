const hljs = require('highlight.js');
const markdownItTocAndAnchor = require('markdown-it-toc-and-anchor').default;
const md = require('markdown-it')({
  html: true,
  linkify: true,
  typography: true,
  highlight(str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      return `<pre><code class="hljs ${lang}">${hljs.highlight(lang, str, true).value}</code></pre>`;
    }
    return `<pre><code class="hljs">${md.utils.escapeHtml(str)}</code></pre>`;
  }
}).use(markdownItTocAndAnchor, {
  tocClassName: 'toc',
  tocLastLevel: 3,
  anchorLinkSymbol: '',
  anchorClassName: 'anchor'
});

module.exports = text => {
  return md.render(text);
};
