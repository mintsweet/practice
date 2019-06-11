const rq = require('request-promise');
const { API } = require('../../../config');

module.exports = (url, data, method = 'GET') => {
  const options = {
    baseUrl: API,
    url,
    method,
    json: true,
    headers: {
      Authorization: global.token || ''
    }
  };

  if (method === 'GET') {
    options.qs = data;
  } else {
    options.body = data;
  }

  return rq(options);
};
