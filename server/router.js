const express = require('express');
const Auth = require('./middleware/auth');
const Common = require('./controller/common');
const User = require('./controller/user');
const Message = require('./controller/message');
const Topic = require('./controller/topic');
const Reply = require('./controller/reply');
const Static = require('./controller/static');

const router = express.Router();

// 静态
router.get('/static/get_start', Static.getStart); // 获取快速开始文档
router.get('/static/api_introduction', Static.getApiIntroduction); // 获取API说明文档
router.get('/static/about', Static.getAbout); // 获取关于文档
router.get('/static/markdown_style', Static.getMarkdown); // 获取Markdown样式文档

// 公共
router.get('/common/piccaptcha', Common.getPicCaptcha);
router.get('/common/msgcaptcha', Common.getMsgCaptcha);

// 用户
router.get('/info', Auth.userRequired, User.getUserInfo); // 获取当前用户信息
router.post('/signup', User.signup); // 注册
router.post('/signin', User.signin); // 登录
router.get('/signout', User.signout); // 登出
router.post('/forget_pass', User.forgetPass); // 忘记密码
router.post('/update_pass', Auth.userRequired, User.updatePass); // 修改密码
router.post('/setting', Auth.userRequired, User.updateUserInfo); // 更新个人信息
router.get('/users/start', User.getStartList); // 获取星标用户列表
router.get('/users/top100', User.getTop100); // 获取积分榜前一百用户列表
router.get('/user/:nickname', User.getInfoNickname); // 获取指定昵称用户信息
router.get('/user/:nickname/collections', User.getUserCollections);  // 获取用户收藏列表
router.get('/user/:nickname/replies', User.getUserReplies); // 用户回复的列表
router.get('/user/:nickname/follower', User.getUserFollower); // 获取用户粉丝列表
router.get('/user/:nickname/following', User.getUserFollowing); // 获取用户关注的人列表

// 主题
router.post('/topic/create', Auth.userRequired, Topic.createTopic); // 新增主题
router.get('/topic/list', Topic.getTopicList); // 获取主题列表
router.get('/topic/search', Topic.searchTopicList); // 搜索主题列表
router.get('/topics/:id', Topic.getTopicDetail); // 获取主题详情
router.post('/topics/:id/edit', Auth.userRequired, Topic.editTopic); // 编辑主题
router.post('/topics/:id/collect', Auth.userRequired, Topic.collectTopic); // 收藏主题
router.post('/topics/:id/un_collect', Auth.userRequired, Topic.unCollectTopic); // 取消收藏主题

// 回复
router.post('/topisc/:tid/reply', Auth.userRequired, Reply.createReply); // 创建回复
router.post('/reply/:rid/edit', Auth.userRequired, Reply.editReply); // 编辑回复
router.delete('/reply/:rid/delete', Auth.userRequired, Reply.deleteReply); // 删除回复
router.get('/reply/:rid/up', Auth.userRequired, Reply.upReply); // 点赞回复

// 消息
router.get('/message', Auth.userRequired, Message.getAllMessage); // 获取所有消息
router.get('/message/:type', Auth.userRequired, Message.getMessageByType); // 根据类型获取消息

module.exports = router;