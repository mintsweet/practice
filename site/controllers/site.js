const { getTopicList, getUsersTop100, getNoReplyTopic } = require('../http/api');

class Site {
  // 首页
  async renderIndex(req, res) {
    const { tab, page } = req.query;

    let response;
    let currentTab;
    let topics;
    let totalPage;
    let currentPage;
    let top100;
    let noReplyTopic;

    try {
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
        res.render('exception/error', {
          title: '首页',
          error: response.message
        });
      }

      response = await getUsersTop100();

      if (response.status === 1) {
        top100 = response.data.slice(0, 10);
      } else {
        res.render('exception/error', {
          title: '首页',
          error: response.message
        });
      }

      response = await getNoReplyTopic();

      if (response.status === 1) {
        noReplyTopic = response.data;
      } else {
        res.render('exception/error', {
          title: '首页',
          error: response.message
        });
      }

      res.render('site/index', {
        title: '首页',
        topics,
        totalPage,
        currentPage,
        currentTab,
        top100,
        noReplyTopic
      });
    } catch(err) {
      res.redner('exception/500', {
        title: 500,
        error: err.message
      });
    }
  }
}

module.exports = new Site();
