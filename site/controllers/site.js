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

    try {
      const top100 = await this.getUsersTop100();
      const noReplyTopic = await this.getNoReplyTopic();
      const response = await getTopicList({
        tab: tab || 'all',
        page: page || 1,
        size: 10
      });

      if (response.status === 1) {
        res.render('site/index', {
          title: '首页',
          topics: response.data.topics,
          totalPage: response.data.totalPage,
          currentPage: response.data.currentPage,
          currentTab: response.data.tab,
          top100,
          noReplyTopic
        });
      } else {
        res.render('exception/error', {
          title: '首页',
          error: response.message
        });
      }
    } catch(err) {
      res.redner('exception/500', {
        title: 500,
        error: err.message
      });
    }
  }
}

module.exports = new Site();
