const API = require('../utils/api');
const config = require('../config');

class Site {
  // 首页
  async renderIndex(req, res) {
    const { tab, page } = req.query;

    const top100 = await API.getUsersTop100();
    const noReplyTopic = await API.getNoReplyTopic({ count: 5 });

    const data = await API.getTopicList({
      tab,
      page,
      size: config.home_topic_count
    });

    return res.render('pages/index', {
      title: '首页',
      topics: data.topics,
      totalPage: data.totalPage,
      currentPage: data.currentPage,
      currentTab: data.currentTab,
      tabs: data.tabs,
      top100: top100.slice(0, 10),
      noReplyTopic
    });
  }
}

module.exports = new Site();
