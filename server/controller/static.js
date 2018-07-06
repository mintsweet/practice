const fs = require('fs');
const path = require('path');
const md2html = require('../utils/md2html');

class Static {
  getQuickStart(req, res) {
    fs.readFile('./controller/static/quick_start.md', 'utf-8', (err, data) => {
      if (err) {
        return res.send({
          status: 0,
          type: 'ERROR_GET_FILE',
          message: err
        });
      }

      const result = md2html(data);

      return res.send({
        status: 1,
        data: result
      });
    });
  }

  getApiDoc(req, res) {
    fs.readFile(path.join(__dirname, '../../API.md'), 'utf-8', (err, data) => {
      if (err) {
        return res.send({
          status: 0,
          type: 'ERROR_GET_FILE',
          message: err
        });
      }

      const result = md2html(data);

      return res.send({
        status: 1,
        data: result
      });
    });
  }

  getAbout(req, res) {
    fs.readFile('./controller/static/about.md', 'utf-8', (err, data) => {
      if (err) {
        return res.send({
          status: 0,
          type: 'ERROR_GET_FILE',
          message: err
        });
      }

      const result = md2html(data);

      return res.send({
        status: 1,
        data: result
      });
    });
  }
}

module.exports = new Static();
