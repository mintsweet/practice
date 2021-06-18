const API = require('../utils/api');
const md2html = require('../utils/md2html');
const BaseService = require('../core/BaseService');

class Render extends BaseService {
  constructor() {
    super();
    this.signup = this.signup.bind(this);
  }

  // 首页
  async home(req, res) {
    const { tab, page } = req.query;

    const [top100, noReplyTopic, data] = await Promise.all([
      API.getUsersTop({ count: 10 }),
      API.getTopicsNoReply({ count: 5 }),
      API.getTopics({
        tab,
        page,
        size: 20,
      }),
    ]);

    res.render('pages/index', {
      title: '首页',
      topics: data.topics,
      totalPage: data.totalPage,
      currentPage: data.currentPage,
      currentTab: data.currentTab,
      top100: top100.slice(0, 10),
      tabs: data.tabs,
      noReplyTopic,
    });
  }

  // 注册页
  async signup(req, res) {
    const url = await this._getCaptchaUrl(req);
    res.render('pages/user/signup', {
      title: '注册',
      url,
    });
  }

  // 登录页
  async signin(req, res) {
    const url = await this._getCaptchaUrl(req);
    res.render('pages/user/signin', {
      title: '登录',
      url,
    });
  }

  // 忘记密码页
  async forgetPass(req, res) {
    const url = await this._getCaptchaUrl(req);
    res.render('pages/user/forget_pass', {
      title: '忘记密码',
      url,
    });
  }

  // 个人设置页
  async setting(req, res) {
    const { id } = req.app.locals.user;

    const [top100, user] = await Promise.all([
      API.getUsersTop(),
      API.getUserById(id),
    ]);

    res.render('pages/user/setting', {
      title: '个人资料',
      top100,
      user,
    });
  }

  // 修改密码页
  async updatePass(req, res) {
    const data = await API.getUsersTop();
    res.render('pages/user/update_pass', {
      title: '修改密码',
      top100: data,
    });
  }

  // 积分榜前一百页
  async userTop100(req, res) {
    const top100 = await API.getUsersTop({ count: 100 });
    res.render('pages/user/top100', {
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

    res.render('pages/user/info', {
      title: '动态 - 用户信息',
      type: 'action',
      info,
      data,
    });
  }

  // 用户专栏页
  async userTopic(req, res) {
    const { uid } = req.params;

    const [info, data] = await Promise.all([
      API.getUserById(uid),
      API.getUserCreate(uid),
    ]);

    res.render('pages/user/info', {
      title: '专栏 - 用户信息',
      type: 'create',
      info,
      data,
    });
  }

  // 用户喜欢页
  async userStar(req, res) {
    const { uid } = req.params;

    const [info, data] = await Promise.all([
      API.getUserById(uid),
      API.getUserLike(uid),
    ]);

    res.render('pages/user/info', {
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

    res.render('pages/user/info', {
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

    res.render('pages/user/info', {
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

    res.render('pages/user/info', {
      title: '关注 - 用户信息',
      type: 'following',
      info,
      data,
    });
  }

  // 创建话题页
  topicCreate(req, res) {
    res.render('pages/topic/create', {
      title: '发布话题',
    });
  }

  // 编辑话题页
  async topicUpdate(req, res) {
    const { tid } = req.params;
    const data = await API.getTopicById(tid);
    res.render('pages/topic/create', {
      title: '编辑话题',
      topic: data.topic,
    });
  }

  // 话题搜索页
  async topicSearch(req, res) {
    const { q } = req.query;

    const noReplyTopic = await API.getTopicsNoReply();
    const data = await API.searchTopics({ title: q });

    res.render(
      'pages/topic/search',
      {
        title: '搜索结果',
        topics: data.topics,
        currentPage: data.currentPage,
        totalPage: data.totalPage,
        total: data.total,
        q,
        noReplyTopic,
      }
    );
  }

  // 话题详情页
  async topicDetail(req, res) {
    const { tid } = req.params;

    const noReplyTopic = await API.getTopicsNoReply();
    const data = await API.getTopicById(tid);

    res.render(
      'pages/topic/detail',
      {
        title: '话题详情',
        topic: {
          ...data.topic,
          content: md2html(data.topic.content)
        },
        author: data.author,
        replies: data.replies,
        like: data.like,
        collect: data.collect,
        noReplyTopic,
      }
    );
  }

  // 用户消息页
  async userNotice(req, res) {
    const { token } = req.session;
    const data = await API.getUserNotice(token);

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
