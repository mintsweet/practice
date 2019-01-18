const request = require('./request');

const getNormsDoc = () => request('/static/norms');

module.exports = {
  getNormsDoc
};
