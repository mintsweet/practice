import request from './request';

exports.getTopicList = params => request(params, '/v1/topics/list');
