const util = require('util');
const fs = require('fs');
const path = require('path');

const readFile = util.promisify(fs.readFile);

class Static {
  async getQuickStart(ctx) {
    const data = await readFile('./controller/static/quick_start.md', 'utf-8');
    ctx.body = data;
  }

  async getApiDoc(ctx) {
    const data = await readFile(path.join(__dirname, '../../API.md'), 'utf-8');
    ctx.body = data;
  }

  async getAbout(ctx) {
    const data = await readFile('./controller/static/about.md', 'utf-8');
    ctx.body = data;
  }
}

module.exports = new Static();
