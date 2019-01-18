const rq = require('request-promise');
const { api } = require('../config');

module.exports = (url, data, method = 'GET') => {
  const options = {
    baseUrl: api[process.env.NODE_ENV],
    url,
    method,
    json: true,
    headers: {
      Authorization: global.token
    }
  };

  if (method === 'GET') {
    options.qs = data;
  } else {
    options.body = data;
  }

  return rq(options);
};
