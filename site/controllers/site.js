const path = require('path');

class Home {
  // 首页
  async index(req, res) {
    const { tab } = req.query;
    let page = req.query.page | 1;
    let size = 10;

    res.render('index', {
      title: '首页'
    });
  }
}

module.exports = new Home();