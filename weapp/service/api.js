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
// 获取无人回复的话题
exports.getNoReplyTopic = count => request('/topics/no_reply', count);
// 根据ID获取话题详情
exports.getTopicDetail = tid => request(`/topic/${tid}`);

/**
 * 消息
 */
// 获取用户消息
exports.getUserNotice = () => request('/notice/user');
// 获取系统消息
exports.getSystemNotice = () => request('/notice/system');