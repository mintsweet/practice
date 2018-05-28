const express = require('express');
const Auth = require('./middleware/auth');
const Common = require('./controller/common');
const User = require('./controller/user');
const Topic = require('./controller/topic');

const router = express.Router();

// 公共
router.get('/common/piccaptcha', Common.getPicCaptcha);
router.get('/common/msgcaptcha', Common.getMsgCaptcha);

// 用户
router.post('/user/signup', User.signup); // 注册
router.post('/user/signin', User.signin); // 登录
router.get('/user/signout', User.signout); // 登出
router.post('/user/forget_pass', User.forgetPass); // 忘记密码
router.post('/user/update_pass', Auth.userRequired, User.updatePass); // 修改密码
router.get('/user/:nickname', User.getInfoNickname); // 获取指定昵称用户信息
router.post('/user/setting', Auth.userRequired, User.updateUserInfo); // 更新个人信息
router.get('/user/start', User.getStartList); // 获取星标用户列表
router.get('/user/top100', User.getTop100); // 获取积分榜前一百用户列表
router.get('/user/:nickname/collections', User.getUserCollections);  // 获取用户收藏列表
router.get('/user/:nickname/replies', User.getUserReplies); // 用户回复的列表
router.get('/user/:nickname/follower', User.getUserFollower); // 获取用户粉丝列表
router.get('/user/:nickname/following', User.getUserFollowing); // 获取用户关注的人列表

// 主题
router.post('/topic/add', Topic.addTopic); // 新增主题

module.exports = router;