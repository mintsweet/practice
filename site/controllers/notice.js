const { getUserNotice, getSystemNotice } = require('../http/api');

class Notice {
  // 用户消息
  async renderNoticeUser(req, res) {
    const data = await getUserNotice(req.app.locals.user.id);

    return res.render('site/notice', {
      title: '用户消息',
      type: 'user',
      data
    });
  }

  // 系统消息
  async renderNoticeSystem(req, res) {
    const data = await getSystemNotice(req.app.locals.user.id);

    return res.render('site/notice', {
      title: '系统消息',
      type: 'system',
      data
    });
  }
}

module.exports = new Notice();
