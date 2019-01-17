const util = require('util');
const fs = require('fs');
const path = require('path');

const readFile = util.promisify(fs.readFile);

class Static {
  async getNorms(ctx) {
    const data = await readFile(path.join(__dirname, '../../assets/norms.md'), 'utf-8');
    ctx.body = data;
  }
}

module.exports = new Static();
