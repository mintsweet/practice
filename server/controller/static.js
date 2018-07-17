const fs = require('fs');
const path = require('path');

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

      return res.send({
        status: 1,
        data
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

      return res.send({
        status: 1,
        data
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

      return res.send({
        status: 1,
        data
      });
    });
  }
}

module.exports = new Static();
