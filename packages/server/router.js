const Router = require('koa-router');
const Auth = require('./middlewares/auth');
const StaticV1 = require('./controllers/v1/static');
const AiderV1 = require('./controllers/v1/aider');
const UserV1 = require('./controllers/v1/user');
const UserV2 = require('./controllers/v2/user');
const TopicV1 = require('./controllers/v1/topic');
const TopicV2 = require('./controllers/v2/topic');
const ReplyV1 = require('./controllers/v1/reply');
const NoticeV1 = require('./controllers/v1/notice');

const routerV1 = new Router({
  prefix: '/v1'
});

routerV1
  .get('/', ctx => { ctx.body = 'Version_1 API'; })
  .get('/static/norms', StaticV1.getNorms) // 获取社区规范文档
  .get('/aider/captcha', AiderV1.getCaptcha) // 获取图形验证码
  .post('/aider/upload_avatar', Auth.userRequired, AiderV1.uploadAvatar) // 头像上传
  .post('/signup', UserV1.signup) // 注册
  .get('/set_active', UserV1.setActive) // 账户激活
  .post('/signin', UserV1.signin) // 登录
  .post('/forget_pass', UserV1.forgetPass) // 忘记密码
  .post('/reset_pass', UserV1.resetPass) // 重置密码
  .get('/info', Auth.userRequired, UserV1.getCurrentUser) // 获取当前用户信息
  .put('/setting', Auth.userRequired, UserV1.updateSetting) // 更新个人信息
  .patch('/update_pass', Auth.userRequired, UserV1.updatePass) // 修改密码
  .get('/users/top', UserV1.getUserTop) // 获取积分榜用户列表
  .get('/user/:uid', UserV1.getUserById) // 根据ID获取用户信息
  .get('/user/:uid/action', UserV1.getUserAction) // 获取用户动态
  .get('/user/:uid/create', UserV1.getUserCreate) // 获取用户专栏列表
  .get('/user/:uid/like', UserV1.getUserLike) // 获取用户喜欢列表
  .get('/user/:uid/collect', UserV1.getUserCollect) // 获取用户收藏列表
  .get('/user/:uid/follower', UserV1.getUserFollower) // 获取用户粉丝列表
  .get('/user/:uid/following', UserV1.getUserFollowing) // 获取用户关注列表
  .patch('/user/:uid/follow_or_un', Auth.userRequired, UserV1.followOrUn) // 关注或者取消关注用户
  .post('/create', Auth.userRequired, TopicV1.createTopic) // 创建话题
  .delete('/topic/:tid/delete', Auth.userRequired, TopicV1.deleteTopic) // 删除话题
  .put('/topic/:tid/update', Auth.userRequired, TopicV1.updateTopic) // 编辑话题
  .get('/topics/list', TopicV1.getTopicList) // 获取话题列表
  .get('/topics/search', TopicV1.searchTopic) // 搜索话题列表
  .get('/topics/no_reply', TopicV1.getNoReplyTopic) // 获取无人回复的话题
  .get('/topic/:tid', TopicV1.getTopicById) // 根据ID获取话题详情
  .patch('/topic/:tid/like_or_un', Auth.userRequired, TopicV1.likeOrUnLike) // 喜欢或者取消喜欢话题
  .patch('/topic/:tid/collect_or_un', Auth.userRequired, TopicV1.collectOrUnCollect) // 收藏或者取消收藏话题
  .post('/topic/:tid/reply', Auth.userRequired, ReplyV1.createReply) // 创建回复
  .delete('/reply/:rid/delete', Auth.userRequired, ReplyV1.deleteReply) // 删除回复
  .put('/reply/:rid/update', Auth.userRequired, ReplyV1.updateReply) // 编辑回复
  .patch('/reply/:rid/up_or_down', Auth.userRequired, ReplyV1.upOrDownReply) // 回复点赞或者取消点赞
  .get('/notice/user', Auth.userRequired, NoticeV1.getUserNotice) // 获取用户消息
  .get('/notice/system', Auth.userRequired, NoticeV1.getSystemNotice); // 获取系统消息

const routerV2 = new Router({
  prefix: '/v2'
});

routerV2
  .get('/', ctx => { ctx.body = 'Version_2 API'; })
  .get('/users/new_this_week', Auth.adminRequired, UserV2.countUserThisWeek) // 获取本周新增用户数
  .get('/users/new_last_week', Auth.adminRequired, UserV2.countUserLastWeek) // 获取上周新增用户数
  .get('/users/total', Auth.adminRequired, UserV2.countUserTotal) // 获取用户总数
  .get('/users/list', Auth.adminRequired, UserV2.getUserList) // 获取用户列表
  .post('/users/create', Auth.adminRequired, UserV2.createUser) // 新增用户
  .delete('/user/:uid/delete', Auth.rootRequired, UserV2.deleteUser) // 删除用户(超管物理删除)
  .patch('/user/:uid/star', Auth.rootRequired, UserV2.starUser) // 设为星标用户
  .patch('/user/:uid/lock', Auth.adminRequired, UserV2.lockUser) // 锁定用户(封号)
  .get('/topics/new_this_week', Auth.adminRequired, TopicV2.countTopicThisWeek) // 获取本周新增话题数
  .get('/topics/new_last_week', Auth.adminRequired, TopicV2.countTopicLastWeek) // 获取上周新增话题数
  .get('/topics/total', Auth.adminRequired, TopicV2.countTopicTotal) // 获取话题总数
  .delete('/topic/:tid/delete', Auth.rootRequired, TopicV2.deleteTopic) // 删除话题(超管物理删除)
  .patch('/topic/:tid/top', Auth.adminRequired, TopicV2.topTopic) // 话题置顶
  .patch('/topic/:tid/good', Auth.adminRequired, TopicV2.goodTopic) // 话题加精
  .patch('/topic/:tid/lock', Auth.adminRequired, TopicV2.lockTopic); // 话题锁定(封贴)

module.exports = {
  v1: routerV1.routes(),
  v2: routerV2.routes()
};
