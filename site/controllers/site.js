const path = require('path');

class Site {
  // 首页
  async index(req, res) {
    const { tab, page, size } = req.query;

    res.render('site/index', {
      title: '首页',
      currentTab: tab || 'all'
    });
  }
}

module.exports = new Site();