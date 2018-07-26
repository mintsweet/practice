const util = require('util');
const fs = require('fs');

const readFile = util.promisify(fs.readFile);

class Static {
  async getQuickStart(req, res) {
    const data = await readFile('./doc/quick_start.md', 'utf-8');
    return res.send({
      status: 1,
      data
    });
  }

  async getApiDoc(req, res) {
    const data = await readFile('../API.md', 'utf-8');
    return res.send({
      status: 1,
      data
    });
  }

  async getAbout(req, res) {
    const data = await readFile('./doc/about.md', 'utf-8');
    return res.send({
      status: 1,
      data
    });
  }
}

module.exports = new Static();
