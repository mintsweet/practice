const API = require('../utils/api');
const Base = require('./base');

class Site extends Base {
  // 首页
  async renderIndex(req, res) {
    const { tab, page } = req.query;

    const top100 = await API.getUsersTop({ count: 10 });
    const noReplyTopic = await API.getTopicsNoReply({ count: 5 });

    const data = await API.getTopics({
      tab,
      page,
      size: 20,
    });

    res.render('pages/index', {
      title: '首页',
      topics: data.topics,
      totalPage: data.totalPage,
      currentPage: data.currentPage,
      currentTab: data.currentTab,
      top100: top100.slice(0, 10),
      tabs: data.tabs,
      noReplyTopic
    });
  }

  // 获取验证码
  async getCaptcha(req, res) {
    const url = this.getCaptchaUrl(req);

    res.send({ status: 1, url });
  }
}

module.exports = new Site();
