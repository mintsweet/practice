const Router = require('koa-router');
const Aider = require('./controller/aider');
const User = require('./controller/user');
const Topic = require('./controller/topic');
const auth = require('./middleware/auth');

const router = new Router();

router
  .get('/captcha', Aider.getCaptcha) // 获取图形验证码
  .post('/upload', auth(), Aider.upload) // 上传文件
  .get('/upload/:filename', Aider.getFile) // 获取文件
  .post('/signup', User.signup) // 注册
  .post('/signin', User.signin) // 登录
  .post('/forget-pass', User.forgetPass) // 忘记密码
  .post('/reset-pass', User.resetPass) // 重置密码
  .get('/info', auth(), User.getUser) // 获取当前登录用户信息
  .put('/setting', auth(), User.updateSetting) // 更新个人信息\
  .put('/password', auth(), User.updatePass) // 修改密码
  .get('/notice/user', auth(), User.getUserNotice) // 获取用户消息
  .get('/notice/system', auth(), User.getSystemNotice) // 获取系统消息
  .get('/users/top', User.getUserTop) // 获取积分榜用户列表
  .get('/user/:uid', User.getUserById) // 根据ID获取用户信息
  .get('/user/:uid/action', User.getUserAction) // 获取用户动态
  .get('/user/:uid/create', User.getUserCreate) // 获取用户专栏列表
  .get('/user/:uid/like', User.getUserLike) // 获取用户喜欢列表
  .get('/user/:uid/collect', User.getUserCollect) // 获取用户收藏列表
  .get('/user/:uid/follower', User.getUserFollower) // 获取用户粉丝列表
  .get('/user/:uid/following', User.getUserFollowing) // 获取用户关注列表
  .put('/user/:uid/follow', auth(), User.followUser) // 关注或者取消关注用户
  .get('/topics', Topic.getTopicList) // 获取话题列表
  .get('/topics/search', Topic.searchTopic) // 搜索话题列表
  .get('/topics/no-reply', Topic.getNoReplyTopic) // 获取无人回复的话题
  .post('/topic', auth(), Topic.createTopic) // 创建话题
  .delete('/topic/:tid', auth(), Topic.deleteTopic) // 删除话题
  .put('/topic/:tid', auth(), Topic.updateTopic) // 编辑话题
  .get('/topic/:tid', Topic.getTopicById) // 根据ID获取话题详情
  .put('/topic/:tid/like', auth(), Topic.liekTopic) // 喜欢或者取消喜欢话题
  .put('/topic/:tid/collect', auth(), Topic.collectTopic) // 收藏或者取消收藏话题
  .post('/topic/:tid/reply', auth(), Topic.createReply); // 创建回复

const routerBe = new Router({ prefix: '/backend' });

routerBe
  .get('/dashboard', auth(1), Aider.dashboard) // 获取系统概览
  .get('/users', auth(1), User.roleGetUserList) // 获取用户列表
  .post('/user', auth(1), User.roleCreateUser) // 新增用户
  .delete('/user/:uid', auth(100), User.roleDeleteUser) // 删除用户(超管物理删除)
  .put('/user/:uid', auth(1), User.roleUpdateUser) // 更新用户
  .put('/user/:uid/star', auth(100), User.roleStarUser) // 设为星标用户
  .put('/user/:uid/lock', auth(1), User.roleLockUser) // 锁定用户(封号)
  .get('/topics', auth(1), Topic.roleGetTopicList) // 获取话题列表
  .post('/topic', auth(1), Topic.roleCreateTopic) // 创建话题
  .delete('/topic/:tid', auth(100), Topic.roleDeleteTopic) // 删除话题(超管物理删除)
  .put('/topic/:tid', auth(1), Topic.roleUpdateTopic) // 更新话题
  .put('/topic/:tid/top', auth(100), Topic.roleTopTopic) // 话题置顶
  .put('/topic/:tid/good', auth(1), Topic.roleGoodTopic) // 话题加精
  .put('/topic/:tid/lock', auth(1), Topic.roleLockTopic); // 话题锁定(封贴)

module.exports = {
  rt: router.routes(),
  be: routerBe.routes(),
};
