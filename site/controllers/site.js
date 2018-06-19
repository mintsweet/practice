const { getTopicList } = require('../http/api');

class Site {
  // 首页
  async index(req, res) {
    const { tab, page } = req.query;

    const response = await getTopicList({
      tab: tab || 'all',
      page: page || 1,
      size: 10
    });

    if (response.status === 1) {
      res.render('site/index', {
        title: '首页',
        currentTab: tab || 'all',
        topics: response.data.topics,
        pages: response.data.pages,
        tab: response.data.tab,
        currentPage: response.data.currentPage
      });
    } else {
      res.redirect('/exception/500');
    }
  }
}

module.exports = new Site();