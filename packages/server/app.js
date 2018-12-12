const Koa = require('koa');
const config = require('./config');

const app = module.exports = new Koa();

if (!module.parent) app.listen(config.port);
