const request = require('./request');

exports.getNormsDoc = () => request('/static/norms');
