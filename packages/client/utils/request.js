const rq = require('request-promise');
const { baseUrl } = require('./env');

module.exports = (url, data, method = 'GET') => {
  const options = {
    baseUrl,
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
