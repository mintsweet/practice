const rq = require('request-promise');
const { baseUrl } = require('./env');

const apiGetUserTop100 = () => rq({
  uri: `${baseUrl}/users/top100`,
  json: true
});

module.exports = {
  apiGetUserTop100
};