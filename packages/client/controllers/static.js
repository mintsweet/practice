const fs = require('fs');
const path = require('path');
const md2html = require('../utils/md2html');

class Static {
  renderNormsDoc(req, res) {
    const data = fs.readFileSync(path.join(__dirname, '../assets/norms.md'), 'utf8');

    res.render('pages/static', {
      title: '社区规范',
      content: md2html(data)
    });
  }
}

module.exports = new Static();
