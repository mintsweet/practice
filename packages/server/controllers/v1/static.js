const util = require('util');
const fs = require('fs');

const readFile = util.promisify(fs.readFile);

class Static {
  async getNorms(ctx) {
    const data = await readFile('./assets/normss.md', 'utf-8');
    ctx.body = data;
  }
}

module.exports = new Static();
