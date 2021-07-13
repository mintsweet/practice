const express = require('express');
const auth = require('./middleware/auth');
const Render = require('./controller/render');
const User = require('./controller/user');
const Topic = require('./controller/topic');

const router = express.Router();

// 异常捕获
const wrap = fn => (...args) => Promise.resolve(fn(...args)).catch(args[2]);

// 页面渲染
router.get('/', wrap(Render.home)); // 首页
router.get('/signup', wrap(Render.signup)); // 注册页
router.get('/signin', wrap(Render.signin)); // 登录页
router.get('/forget_pass', wrap(Render.forgetPass)); // 忘记密码页
router.get('/setting', auth(), wrap(Render.setting)); // 设置页
router.get('/update_pass', auth(), wrap(Render.updatePass)); // 修改密码页
router.get('/users/top100', wrap(Render.userTop100)); // 积分榜前一百页
router.get('/user/:uid', wrap(Render.userInfo)); // 用户信息页
router.get('/user/:uid/create', wrap(Render.userCreate)); // 用户主题页
router.get('/user/:uid/like', wrap(Render.userLike)); // 用户点赞页
router.get('/user/:uid/collect', wrap(Render.userCollect)); // 用户收藏
router.get('/user/:uid/follower', wrap(Render.userFollower)); // 用户粉丝页
router.get('/user/:uid/following', wrap(Render.userFollowing)); // 用户关注页
router.get('/topic/create', auth(), wrap(Render.topicCreate)); // 创建话题页
router.get('/topic/update', auth(), wrap(Render.topicUpdate)); // 更新话题页
router.get('/topic/:tid', wrap(Render.topicDetail)); // 话题详情页
router.get('/topics/search', wrap(Render.topicSearch)); // 话题搜索页
router.get('/notice/user', auth(), wrap(Render.userNotice)); // 用户消息页
router.get('/notice/system', auth(), wrap(Render.systemNotice)); // 系统消息页

// 接口
router.get('/captcha', wrap(User.getCaptcha)); // 获取图形验证码
router.post('/signup', wrap(User.signup)); // 注册
router.post('/signin', wrap(User.signin)); // 登录
router.get('/signout', wrap(User.signout)); // 退出登录
router.post('/forget_pass', wrap(User.forgetPass)); // 忘记密码
router.post('/setting', auth(), wrap(User.setting)); // 更新设置
router.post('/update_pass', auth(), wrap(User.updatePass)); // 修改密码
router.post('/user/:uid/follow_or_un', wrap(User.followOrUn)); // 关注或者取消关注用户
router.post('/topic/create', auth(), wrap(Topic.createTopic)); // 创建话题
router.delete('/topic/:tid', auth(), wrap(Topic.deleteTopic)); // 删除话题
router.put('/topic/:tid', auth(), wrap(Topic.editTopic)); // 更新话题
router.post('/topic/:tid/like', wrap(Topic.likeTopic)); // 点赞或取消点赞话题
router.post('/topic/:tid/collect_or_un', wrap(Topic.collectOrUn)); // 收藏或取消收藏话题
router.post('/topic/:tid/reply', wrap(Topic.createReply)); // 创建回复
router.post('/reply/:rid/up', wrap(Topic.upReplyOrUn)); // 回复点赞

module.exports = router;
