const hljs = require('highlight.js');
const md = require('markdown-it')({
  html: true,
  linkify: true,
  typography: true,
  highlight(str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      return `<pre><code class="hljs ${lang}">${hljs.highlight(lang, str, true).value}</code></pre>`;
    } else {
      return `<pre><code class="hljs">${md.utils.escapeHtml(str)}</code></pre>`;
    }
  }
});

module.exports = text => {
  return md.render(text);
};
