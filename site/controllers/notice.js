const { getUserNotice, getSystemNotice } = require('../http/api');

class Notice {
  // 用户消息
  async renderNoticeUser(req, res) {
    const response = await getUserNotice(req.app.locals.user.id);

    if (response.status === 1) {
      return res.render('notice/template', {
        title: '用户消息',
        type: 'user',
        data: response.data
      });
    } else {
      return res.redirect('/exception/500');
    }
  }

  // 系统消息
  async renderNoticeSystem(req, res) {
    const response = await getSystemNotice(req.app.locals.user.id);

    if (response.status === 1) {
      return res.render('notice/template', {
        title: '系统消息',
        type: 'system',
        data: response.data
      });
    } else {
      return res.redirect('/exception/500');
    }
  }
}

module.exports = new Notice();
