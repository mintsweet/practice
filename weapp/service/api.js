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
// 注册
exports.signup = info => request('/signup', info, 'POST');
// 登录
exports.signin = info => request('/signin', info, 'POST');
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
// 喜欢或者取消喜欢话题
exports.likeOrUn = tid => request(`/topic/${tid}/like_or_un`, {}, 'PATCH', jwt);
// 收藏或者取消收藏话题
exports.collectOrUn = tid => request(`/topic/${tid}/collect_or_un`, {}, 'PATCH');

/**
 * 回复
 */
// 回复点赞
exports.upReply = rid => request(`/reply/${rid}/up`, {}, 'PATCH');

/**
 * 消息
 */
// 获取用户消息
exports.getUserNotice = () => request('/notice/user');
// 获取系统消息
exports.getSystemNotice = () => request('/notice/system');