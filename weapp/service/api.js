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
 * 用户
 */
// 根据ID获取用户信息
exports.getUserInfoById = uid => request(`/user/${uid}`);

/**
 * 话题
 */
// 获取话题列表
exports.getTopicList = params => request('/topics/list', params);
// 搜索话题列表
exports.getTopicBySearch = params => request('/topics/search', params);
// 根据ID获取话题详情
exports.getTopicDetail = tid => request(`/topic/${tid}`);