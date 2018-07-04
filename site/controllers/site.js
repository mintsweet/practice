const { getTopicList, getUsersTop100 } = require('../http/api');

class Site {
  // 首页
  async index(req, res) {
    const { tab, page } = req.query;

    let response;
    let currentTab;
    let topics;
    let totalPage;
    let currentPage;
    let top100;

    response = await getTopicList({
      tab: tab || 'all',
      page: page || 1,
      size: 10
    });

    if (response.status === 1) {
      topics = response.data.topics;
      totalPage = response.data.totalPage;
      currentPage = response.data.currentPage;
      currentTab = response.data.tab;
    } else {
      res.redirect('/exception/500');
    }

    response = await getUsersTop100();

    if (response.status === 1) {
      top100 = response.data;
    } else {
      res.redirect('/exception/500');
    }

    res.render('site/index', {
      title: '首页',
      topics,
      totalPage,
      currentPage,
      currentTab,
      top100
    });
  }
}

module.exports = new Site();
