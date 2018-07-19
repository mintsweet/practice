const logger = require('../utils/logger');

// 404
exports.error404 = (req, res) => {
  return res.status(404).send({
    status: 0,
    type: 'ERROR_NOT_FIND_THAT',
    message: '找不到请求资源'
  });
};

/* eslint-disable no-unused-vars */
exports.error500 = (err, req, res, next) => {
  logger.error(err.message);
  return res.status(500).send({
    status: 0,
    type: 'ERROR_SERVICE',
    message: err.message
  });
};
