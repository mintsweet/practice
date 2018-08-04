const Router = require('koa-router');
const Auth = require('./middlewares/auth');
const AiderV1 = require('./controllers/v1/aider');
const StaticV1 = require('./controllers/v1/static');
const UserV1 = require('./controllers/v1/user');
const TopicV1 = require('./controllers/v1/topic');
const ReplyV1 = require('./controllers/v1/reply');
const NoticeV1 = require('./controllers/v1/notice');
const UserV2 = require('./controllers/v2/user');
const TopicV2 = require('./controllers/v2/topic');

const routerV1 = new Router({
  prefix: '/v1'
});

routerV1
  .get('/', ctx => { ctx.body = 'Version_1 API'; }) // V1入口测试
  .get('/aider/captcha', AiderV1.getCaptcha) // 获取图形验证码
  .get('/aider/sms_code', AiderV1.getSmscode) // 获取短信验证码
  .get('/static/quick_start', StaticV1.getQuickStart) // 获取快速开始文档
  .get('/static/api_doc', StaticV1.getApiDoc) // 获取API说明文档
  .get('/static/about', StaticV1.getAbout) // 获取关于文档
  .post('/signup', UserV1.signup) // 注册
  .post('/signin', UserV1.signin) // 登录
  .patch('/forget_pass', UserV1.forgetPass) // 忘记密码
  .get('/info', Auth.userRequired, UserV1.getUserInfo) // 获取当前用户信息
  .put('/setting', Auth.userRequired, UserV1.updateSetting) // 更新个人信息
  .patch('/update_pass', Auth.userRequired, UserV1.updatePass) // 修改密码
  .get('/users/star', UserV1.getStar) // 获取星标用户列表
  .get('/users/top100', UserV1.getTop100) // 获取积分榜前一百用户列表
  .get('/user/:uid', UserV1.getInfoById) // 根据ID获取用户信息
  .get('/user/:uid/action', UserV1.getUserAction) // 获取用户动态
  .get('/user/:uid/create', UserV1.getUserCreate) // 获取用户专栏列表
  .get('/user/:uid/like', UserV1.getUserLike) // 获取用户喜欢列表
  .get('/user/:uid/collect', UserV1.getUserCollect) // 获取用户收藏列表
  .get('/user/:uid/follower', UserV1.getUserFollower) // 获取用户粉丝列表
  .get('/user/:uid/following', UserV1.getUserFollowing) // 获取用户关注列表
  .patch('/user/:uid/follow_or_un', Auth.userRequired, UserV1.followOrUn) // 关注或者取消关注用户
  .post('/create', Auth.userRequired, TopicV1.createTopic) // 创建话题
  .delete('/topic/:tid/delete', Auth.userRequired, TopicV1.deleteTopic) // 删除话题
  .put('/topic/:tid/edit', Auth.userRequired, TopicV1.editTopic) // 编辑话题
  .get('/topics/list', TopicV1.getTopicList) // 获取话题列表
  .get('/topics/search', TopicV1.searchTopic) // 搜索话题列表
  .get('/topics/no_reply', TopicV1.getNoReplyTopic) // 获取无人回复的话题
  .get('/topic/:tid', TopicV1.getTopicById) // 根据ID获取话题详情
  .patch('/topic/:tid/like_or_un', Auth.userRequired, TopicV1.likeOrUnLike) // 喜欢或者取消喜欢话题
  .patch('/topic/:tid/collect_or_un', Auth.userRequired, TopicV1.collectOrUnCollect) // 收藏或者取消收藏话题
  .post('/topic/:tid/reply', Auth.userRequired, ReplyV1.createReply) // 创建回复
  .delete('/reply/:rid/delete', Auth.userRequired, ReplyV1.deleteReply) // 删除回复
  .put('/reply/:rid/edit', Auth.userRequired, ReplyV1.editReply) // 编辑回复
  .patch('/reply/:rid/up', Auth.userRequired, ReplyV1.upReply) // 回复点赞
  .get('/notice/user', Auth.userRequired, NoticeV1.getUserNotice) // 获取用户消息
  .get('/notice/system', Auth.userRequired, NoticeV1.getSystemNotice); // 获取系统消息

const routerV2 = new Router({
  prefix: '/v2'
});

routerV2
  .get('/', ctx => { ctx.body = 'Version_2 API'; }) // V2入口测试
  .get('/user/new_this_week', Auth.adminRequired, UserV2.countUserThisWeek) // 获取本周新增用户数
  .get('/user/new_last_week', Auth.adminRequired, UserV2.countUserLastWeek) // 获取上周新增用户数
  .get('/user/total', Auth.adminRequired, UserV2.countUserTotal) // 获取用户总数
  .get('/topic/new_this_week', Auth.adminRequired, TopicV2.countTopicThisWeek) // 获取本周新增话题数
  .get('/topic/new_last_week', Auth.adminRequired, TopicV2.countTopicLastWeek) // 获取上周新增话题数
  .get('/topic/total', Auth.adminRequired, TopicV2.countTopicTotal); // 获取话题总数

module.exports = {
  v1: routerV1.routes(),
  v2: routerV2.routes()
};
