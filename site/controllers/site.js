const { getTopicList, getUsersTop100 } = require('../http/api');

class Site {
  // 首页
  async index(req, res) {
    const { tab, page } = req.query;

    const resTopic = await getTopicList({
      tab: tab || 'all',
      page: page || 1,
      size: 10
    });

    const resUserTop100 = await getUsersTop100();

    if (resTopic.status === 1 && resUserTop100.status === 1) {
      res.render('site/index', {
        title: '首页',
        currentTab: tab || 'all',
        topics: resTopic.data.topics,
        pages: resTopic.data.pages,
        tab: resTopic.data.tab,
        currentPage: resTopic.data.currentPage,
        top100: resUserTop100.data
      });
    } else {
      res.redirect('/exception/500');
    }
  }
}

module.exports = new Site();
