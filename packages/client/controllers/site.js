class Site {
  renderIndex(req, res) {
    res.render('pages/index', {
      title: '首页'
    });
  }
}

module.exports = new Site();
