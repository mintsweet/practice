const hljs = require('highlight.js');
const markdownItTocAndAnchor = require('markdown-it-toc-and-anchor').default;
const md = require('markdown-it')({
  html: true,
  linkify: true,
  typography: true,
  highlight: function (str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      return `<pre><code class="hljs ${lang}">${hljs.highlight(lang, str, true).value}</code></pre>`;
    }
    return '<pre><code class="hljs">' + md.utils.escapeHtml(str) + '</code></pre>';
  }
}).use(markdownItTocAndAnchor, {
  tocClassName: 'toc',
  tocLastLevel: 3,
  anchorLinkSymbol: '',
  anchorClassName: 'anchor'
});
const fs = require('fs');

class Static {
  getStart(req, res) {
    fs.readFile('./data/static/get_start.md', 'utf-8', (err, data) => {
      if (err) {
        return res.send({
          status: 0,
          type: 'ERROR_GET_FILE',
          message: err
        });
      }

      const result = md.render(data);
      
      return res.send({
        status: 1,
        data: result
      });
    });
  }

  getApiIntroduction(req, res) {
    fs.readFile('./API.md', 'utf-8', (err, data) => {
      if (err) {
        return res.send({
          status: 0,
          type: 'ERROR_GET_FILE',
          message: err
        });
      }

      const result = md.render(data);
      
      return res.send({
        status: 1,
        data: result
      });
    });
  }

  getAbout(req, res) {
    fs.readFile('./data/static/about.md', 'utf-8', (err, data) => {
      if (err) {
        return res.send({
          status: 0,
          type: 'ERROR_GET_FILE',
          message: err
        });
      }

      const result = md.render(data);
      
      return res.send({
        status: 1,
        data: result
      });
    });
  }

  getMarkdown(req, res) {
    fs.readFile('./data/static/markdown_style.md', 'utf-8', (err, data) => {
      if (err) {
        return res.send({
          status: 0,
          type: 'ERROR_GET_FILE',
          message: err
        });
      }

      const result = md.render(data);
      
      return res.send({
        status: 1,
        data: result
      });
    });
  }
}

module.exports = new Static();
