const request = require('./request');

// 获取图片验证码
exports.getCaptcha = params => request('/captcha', params);

// GitHub 登录
exports.github = params => request('/github', params, 'POST');

// 注册
exports.signup = params => request('/signup', params, 'POST');

// 登录
exports.signin = params => request('/signin', params, 'POST');

// 头像上传
exports.uploadAvatar = params => request('/upload_avatar', params);

// 账户激活
exports.setActive = params => request('/set_active', params);

// 忘记密码
exports.forgetPass = params => request('/forget_pass', params, 'POST');

// 重置密码
exports.resetPass = params => request('/reset_pass', params, 'POST');

// 获取当前用户信息
exports.getCurrentUser = token => request('/info', {}, 'GET', token);

// 更新个人信息
exports.updateSetting = (params, token) => request('/setting', params, 'PUT', token);

// 修改密码
exports.updatePass = (params, token) => request('/update_pass', params, 'PATCH', token);

// 获取积分榜用户列表
exports.getUsersTop = params => request('/v1/users/top', params);

// 根据ID获取用户信息
exports.getUserById = uid => request(`/v1/user/${uid}`);

// 获取用户动态
exports.getUserAction = uid => request(`/v1/user/${uid}/action`);

// 获取用户专栏列表
exports.getUserCreate = uid => request(`/v1/user/${uid}/create`);

// 获取用户喜欢列表
exports.getUserLike = uid => request(`/v1/user/${uid}/like`);

// 获取用户收藏列表
exports.getUserCollect = uid => request(`/v1/user/${uid}/collect`);

// 获取用户粉丝列表
exports.getUserFollower = uid => request(`/v1/user/${uid}/follower`);

// 获取用户关注列表
exports.getUserFollowing = uid => request(`/v1/user/${uid}/following`);

// 关注或者取消关注用户
exports.followOrUn = (uid, token) => request(`/v1/user/${uid}/follow_or_un`, {}, 'PATCH', token);

// 创建话题
exports.createTopic = (params, token) => request('/v1/create', params, 'POST', token);

// 删除话题
exports.deleteTopic = (tid, token) => request(`/v1/topic/${tid}/delete`, {}, 'DELETE', token);

// 编辑话题
exports.editTopic = (tid, params, token) => request(`/v1/topic/${tid}/update`, params, 'PUT', token);

// 获取话题列表
exports.getTopics = params => request('/v1/topics/list', params);

// 搜索话题列表
exports.searchTopics = params => request('/v1/topics/search', params);

// 获取无人回复的话题
exports.getTopicsNoReply = params => request('/v1/topics/no_reply', params);

// 根据ID获取话题详情
exports.getTopicById = tid => request(`/v1/topic/${tid}`);

// 喜欢或者取消喜欢话题
exports.likeOrUn = (tid, token) => request(`/v1/topic/${tid}/like_or_un`, {}, 'PATCH', token);

// 收藏或者取消收藏话题
exports.collectOrUn = (tid, token) => request(`/v1/topic/${tid}/collect_or_un`, {}, 'PATCH', token);

// 创建回复
exports.createReply = (tid, params, token) => request(`/v1/topic/${tid}/reply`, params, 'POST', token);

// 删除回复
exports.deleteReply = (rid, token) => request(`/v1/reply/${rid}/delete`, {}, 'DELETE', token);

// 编辑回复
exports.editReply = (rid, params, token) => request(`/v1/reply/${rid}/update`, params, 'PUT', token);

// 回复点赞或者取消点赞
exports.upOrDown = (rid, token) => request(`/v1/reply/${rid}/up_or_down`, {}, 'PATCH', token);

// 获取用户消息
exports.getUserNotice = token => request('/v1/notice/user', {}, 'GET', token);

// 获取系统消息
exports.getSystemNotice = token => request('/v1/notice/system', {}, 'GET', token);
