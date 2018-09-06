const { getUserNotice, getSystemNotice } = require('../http/api');

class Notice {
  // 用户消息
  async renderNoticeUser(req, res) {
    const { jwt } = req.app.locals;
    const data = await getUserNotice(jwt);
    return res.render('pages/notice', {
      title: '用户消息',
      type: 'user',
      data
    });
  }

  // 系统消息
  async renderNoticeSystem(req, res) {
    const { jwt } = req.app.locals;
    const data = await getSystemNotice(jwt);
    return res.render('pages/notice', {
      title: '系统消息',
      type: 'system',
      data
    });
  }
}

module.exports = new Notice();
