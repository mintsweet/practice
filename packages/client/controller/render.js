const API = require('../utils/api');
const md2html = require('../utils/md2html');
const BaseService = require('../core/BaseService');

class Render extends BaseService {
  constructor() {
    super();
    this.signup = this.signup.bind(this);
    this.signin = this.signin.bind(this);
    this.forgetPass = this.forgetPass.bind(this);
  }

  // 首页
  async home(req, res) {
    const { tab = 'all', page = 1 } = req.query;

    const [data, top100, noReplyTopic] = await Promise.all([
      API.getTopics({
        tab,
        page,
        size: 20,
      }),
      API.getUsersTop({ count: 10 }),
      API.getTopicsNoReply({ count: 5 }),
    ]);

    res.render('pages/index', {
      title: '首页',
      topics: data.list,
      totalPage: Math.ceil(data.total / 20),
      currentPage: page,
      currentTab: tab,
      top100,
      noReplyTopic,
    });
  }

  // 注册页
  async signup(req, res) {
    const url = await this._getCaptchaUrl(req);
    res.render('pages/signup', {
      title: '注册',
      url,
    });
  }

  // 登录页
  async signin(req, res) {
    const url = await this._getCaptchaUrl(req);
    res.render('pages/signin', {
      title: '登录',
      url,
    });
  }

  // 忘记密码页
  async forgetPass(req, res) {
    const url = await this._getCaptchaUrl(req);
    res.render('pages/forget-pass', {
      title: '忘记密码',
      url,
    });
  }

  // 个人设置页
  async setting(req, res) {
    const { _id } = req.app.locals.user;

    const [user, top100] = await Promise.all([
      API.getUserById(_id),
      API.getUsersTop({ count: 10 }),
    ]);

    res.render('pages/user/setting', {
      title: '个人资料',
      user,
      top100,
    });
  }

  // 修改密码页
  async updatePass(_, res) {
    const data = await API.getUsersTop();

    res.render('pages/user/update_pass', {
      title: '修改密码',
      top100: data,
    });
  }

  // 积分榜前一百页
  async userTop100(_, res) {
    const top100 = await API.getUsersTop({ count: 100 });
    res.render('pages/users-top', {
      title: '积分榜前一百',
      top100,
    });
  }

  // 个人信息页
  async userInfo(req, res) {
    const { uid } = req.params;

    const [info, data] = await Promise.all([
      API.getUserById(uid),
      API.getUserAction(uid),
    ]);

    res.render('pages/user-info', {
      title: '动态 - 用户信息',
      type: 'action',
      info,
      data,
    });
  }

  // 用户专栏页
  async userCreate(req, res) {
    const { uid } = req.params;

    const [info, data] = await Promise.all([
      API.getUserById(uid),
      API.getUserCreate(uid),
    ]);

    res.render('pages/user-info', {
      title: '专栏 - 用户信息',
      type: 'create',
      info,
      data,
    });
  }

  // 用户喜欢页
  async userLike(req, res) {
    const { uid } = req.params;

    const [info, data] = await Promise.all([
      API.getUserById(uid),
      API.getUserLike(uid),
    ]);

    res.render('pages/user-info', {
      title: '喜欢 - 用户信息',
      type: 'like',
      info,
      data,
    });
  }

  // 用户收藏页
  async userCollect(req, res) {
    const { uid } = req.params;

    const [info, data] = Promise.all([
      API.getUserById(uid),
      API.getUserCollect(uid),
    ]);

    res.render('pages/user-info', {
      title: '收藏 - 用户信息',
      type: 'collect',
      info,
      data,
    });
  }

  // 用户粉丝页
  async userFollower(req, res) {
    const { uid } = req.params;

    const [info, data] = Promise.all([
      API.getUserById(uid),
      API.getUserFollower(uid),
    ]);

    res.render('pages/user-info', {
      title: '粉丝 - 用户信息',
      type: 'follower',
      info,
      data,
    });
  }

  // 用户关注页
  async userFollowing(req, res) {
    const { uid } = req.params;

    const [info, data] = Promise.all([
      API.getUserById(uid),
      API.getUserFollowing(uid),
    ]);

    res.render('pages/user-info', {
      title: '关注 - 用户信息',
      type: 'following',
      info,
      data,
    });
  }

  // 创建话题页
  topicCreate(_, res) {
    res.render('pages/topic-create', {
      title: '发布话题',
    });
  }

  // 编辑话题页
  async topicUpdate(req, res) {
    const { tid } = req.params;

    const data = await API.getTopicById(tid);

    res.render('pages/topic-create', {
      title: '编辑话题',
      topic: data.topic,
    });
  }

  // 话题详情页
  async topicDetail(req, res) {
    const { tid } = req.params;

    const [data, noReplyTopic] = await Promise.all([
      API.getTopicById(tid),
      API.getTopicsNoReply(),
    ]);

    res.render('pages/topic-detail', {
      title: '话题详情',
      topic: {
        ...data,
        content: md2html(data.content),
      },
      noReplyTopic,
    });
  }

  // 话题搜索页
  async topicSearch(req, res) {
    const { q } = req.query;

    const [data, noReplyTopic] = await Promise.all([
      API.searchTopics({ title: q }),
      API.getTopicsNoReply(),
    ]);

    res.render('pages/topic-search', {
      title: '搜索结果',
      topics: data.list,
      totalPage: Math.ceil(data.total / 20),
      total: data.total,
      q,
      noReplyTopic,
    });
  }

  // 用户消息页
  async userNotice(req, res) {
    const { token } = req.session;

    const data = await API.getNoticeUser(token);

    res.render('pages/notice', {
      title: '用户消息',
      type: 'user',
      data,
    });
  }

  // 系统消息页
  async systemNotice(req, res) {
    const { token } = req.session;

    const data = await API.getSystemNotice(token);

    res.render('pages/notice', {
      title: '系统消息',
      type: 'system',
      data,
    });
  }
}

module.exports = new Render();
