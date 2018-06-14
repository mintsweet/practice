class Site {
  // 新增主题页
  async renderCreate(req, res) {
    res.render('topic/create', {
      title: '发布主题',
    });
  }
}

module.exports = new Site();