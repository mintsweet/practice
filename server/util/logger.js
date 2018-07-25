const path = require('path');
const log4js = require('log4js');

const env = process.env.NODE_ENV || 'production';

log4js.configure({
  appenders: { cheese: { type: 'file', filename: path.join(__dirname, '../log/cheese.log') } },
  categories: { default: { appenders: ['cheese'], level: env !== 'production' ? 'debug' : 'error' } }
});

const logger = log4js.getLogger('cheese');

module.exports = logger;
