const rq = require('request-promise');
const { API } = require('../../../config');

module.exports = async (url, data, method = 'GET', token = '') => {
  const options = {
    baseUrl: API,
    url,
    method,
    json: true,
    headers: {
      Authorization: token
    }
  };

  if (method === 'GET') {
    options.qs = data;
  } else {
    options.body = data;
  }

  try {
    const res = await rq(options);
    return res;
  } catch(err) {
    throw new Error(err);
  }
};
