const BaseComponent = require('../prototype/BaseComponent');
const { getTopicList } = require('../http/api');

class Site extends BaseComponent {
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
      size: 10
    });

    res.render('site/index', {
      title: '首页',
      topics: data.topics,
      totalPage: data.totalPage,
      currentPage: data.currentPage,
      currentTab: data.tab,
      top100,
      noReplyTopic
    });
  }
}

module.exports = new Site();
