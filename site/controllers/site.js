const { getUsersTop100, getNoReplyTopic, getTopicList } = require('../http/api');

class Site {
  constructor() {
    this.renderIndex = this.renderIndex.bind(this);
  }

  // 首页
  async renderIndex(req, res) {
    const { tab, page } = req.query;

    const top100 = await getUsersTop100();
    const noReplyTopic = await getNoReplyTopic({ count: 5 });

    const data = await getTopicList({
      tab: tab || 'all',
      page: page || 1,
      size: 20
    });

    return res.render('pages/index', {
      title: '首页',
      topics: data.topics,
      totalPage: data.totalPage,
      currentPage: data.currentPage,
      currentTab: data.currentTab,
      top100: top100.slice(0, 10),
      noReplyTopic
    });
  }
}

module.exports = new Site();
