import request from './request';

/**
 * 静态
 */
// 快速开始
exports.getQuickStartDoc = () => request('/static/quick_start');
// API说明
exports.getApiDoc = () => request('/static/api_doc');
// 关于
exports.getAboutDoc = () => request('/static/about');

/**
 * 话题
 */
// 获取话题列表
exports.getTopicList = params => request('/topics/list', params);
