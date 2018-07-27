const util = require('util');
const fs = require('fs');

const readFile = util.promisify(fs.readFile);

class Static {
  async getQuickStart(ctx) {
    const data = await readFile('./models/data/quick_start.md', 'utf-8');
    ctx.body = data;
  }

  async getApiDoc(ctx) {
    const data = await readFile('../API.md', 'utf-8');
    ctx.body = data;
  }

  async getAbout(ctx) {
    const data = await readFile('./models/data/about.md', 'utf-8');
    ctx.body = data;
  }
}

module.exports = new Static();
