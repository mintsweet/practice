const API = require('../utils/api');

class Site {
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

    res.render(
      'pages/index',
      {
        title: '首页',
        topics: data.topics,
        totalPage: data.totalPage,
        currentPage: data.currentPage,
        currentTab: data.currentTab,
        top100: top100.slice(0, 10),
        tabs: data.tabs,
        noReplyTopic
      }
    );
  }

  // 获取验证码
  async getCaptcha(req, res) {
    try {
      const data = await API.getCaptcha({
        height: 34,
      });

      req.session.captcha = {
        token: data.token,
        expired: Date.now() + 1000 * 60 * 10,
      };

      res.send({ status: 1, url: data.url });
    } catch(err) {
      res.send({ status: 0, message: err.message });
    }
  }
}

module.exports = new Site();
