import request from './request';

exports.getQuickStartDoc = params => request(params, '/v1/static/quick_start');
