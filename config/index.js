const defaultConfig = require('./default');
let userConfig;

// 不提交用户个人配置，容错
try {
  // eslint-disable-next-line
  userConfig = require('./custom');
} catch(err) {
  userConfig = {};
}

module.exports = Object.assign({}, defaultConfig, userConfig);
