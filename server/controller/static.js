const fs = require('fs');
const md2html = require('../utils/md2html');

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

      const result = md2html(data);
      
      return res.send({
        status: 1,
        data: result
      });
    });
  }

  getApiIntroduction(req, res) {
    fs.readFile('./data/static/api.md', 'utf-8', (err, data) => {
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
    fs.readFile('./data/static/about.md', 'utf-8', (err, data) => {
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
