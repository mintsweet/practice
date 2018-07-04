class Notice {
  // 用户消息
  renderNoticeUser(req, res) {
    return res.render('notice/index', {
      title: '用户消息'
    });
  }

  // 系统消息
  renderNoticeSystem(req, res) {
    return res.render('notice/index', {
      title: '系统消息'
    });
  }
}

module.exports = new Notice();
