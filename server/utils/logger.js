const path = require('path');
const log4js = require('log4js');

log4js.configure({
  appenders: { cheese: { type: 'file', filename: path.join(__dirname, '../log/cheese.log') } },
  categories: { default: { appenders: ['cheese'], level: process.env.NODE_ENV === 'production' ? 'error' : 'debug' } }
});

const logger = log4js.getLogger('cheese');

module.exports = logger;

