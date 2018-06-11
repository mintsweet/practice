const path = require('path');

class Home {
  // 首页
  async index(req, res) {
    const { tab, page, size } = req.query;

    res.render('site/index', {
      title: '首页'
    });
  }
}

module.exports = new Home();