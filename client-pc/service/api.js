const rq = require('request-promise');
const { baseUrl } = require('./env');

exports.apiGetUserTop100 = () => rq({
  uri: `${baseUrl}/users/top100`,
  json: true
});

exports.apiSignin = obj => rq({
  uri: `${baseUrl}/signin`,
  body: obj,
  json: true
});
