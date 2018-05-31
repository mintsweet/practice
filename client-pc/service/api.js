const rq = require('request-promise');
const { baseUrl } = require('./env');

exports.apiGetUserTop100 = () => rq({
  uri: `${baseUrl}/users/top100`,
  json: true
});

exports.apiSignin = obj => rq({
  method: 'POST',
  uri: `${baseUrl}/signin`,
  body: obj,
  json: true,
  jar: true
});

exports.apiGetUserInfo = () => rq({
  uri: `${baseUrl}/info`,
  json: true,
  jar: true
});
