const Base = require('./base');
const { getTopicList } = require('../http/api');

class Site extends Base {
  constructor() {
    super();
    this.renderIndex = this.renderIndex.bind(this);
  }

  // 首页
  async renderIndex(req, res) {
    const { tab, page } = req.query;

    const top100 = await this.getUsersTop100();
    const noReplyTopic = await this.getNoReplyTopic();

    const data = await getTopicList({
      tab: tab || 'all',
      page: page || 1,
      size: 20
    });

    return res.render('site/index', {
      title: '首页',
      topics: data.topics,
      totalPage: data.totalPage,
      currentPage: data.currentPage,
      currentTab: data.tab,
      top100: top100.slice(0, 10),
      noReplyTopic
    });
  }
}

module.exports = new Site();
