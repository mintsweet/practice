class Home {
  
  // 首页
  index(req, res) {
    res.render('index', {
      title: '首页',
    });
  }

  // 新手入门
  getStart(req, res) {
    res.render('getStart', {
      titile: '新手入门',
    });
  }

  // API说明
  apiIntroduction(req, res) {
    res.render('apiIntroduction', {
      titile: 'API说明',
    });
  }

  // 关于
  about(req, res) {
    res.render('about', {
      titile: '关于',
    });
  }
}

module.exports = new Home();