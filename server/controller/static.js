const md = require('markdown-it')();
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
}

module.exports = new Static();
