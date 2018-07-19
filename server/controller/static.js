const fs = require('fs');
const path = require('path');

class Static {
  async getQuickStart(req, res) {
    const data = await fs.readFile('./controller/static/quick_start.md', 'utf-8');

    return res.send({
      status: 1,
      data
    });
  }

  async getApiDoc(req, res) {
    const data = await fs.readFile(path.join(__dirname, '../../API.md'), 'utf-8');

    return res.send({
      status: 1,
      data
    });
  }

  async getAbout(req, res) {
    const data = await fs.readFile('./controller/static/about.md', 'utf-8');

    return res.send({
      status: 1,
      data
    });
  }
}

module.exports = new Static();
