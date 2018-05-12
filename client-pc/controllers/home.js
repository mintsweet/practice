class Home {
  
  // 首页
  index(req, res) {
    res.render('index', {
      title: '哈哈哈哈',
      message: '嘻嘻嘻'
    });
  }

}

module.exports = new Home;