const defaultConfig = require('./default');
const userConfig = require('./custom');

module.exports = Object.assign({}, defaultConfig, userConfig);
