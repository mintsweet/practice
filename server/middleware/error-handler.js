const logger = require('../utils/logger');

// 404
exports.error404 = (req, res) => {
  res.status(404).send({
    status: 0,
    type: 'ERROR_NOT_FIND_THAT',
    message: '找不到请求资源'
  });
};

exports.error500 = (err, req, res) => {
  logger.error(err.stack);
  res.status(500).send({
    status: 0,
    type: 'ERROR_SERVICE',
    message: '服务器无响应，请稍后重试'
  });
};
