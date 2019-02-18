const API = require('../utils/api');

class Notice {
  // 用户消息
  async renderNoticeUser(req, res) {
    const data = await API.getUserNotice();
    return res.render('pages/notice', {
      title: '用户消息',
      type: 'user',
      data
    });
  }

  // 系统消息
  async renderNoticeSystem(req, res) {
    const data = await API.getSystemNotice();
    return res.render('pages/notice', {
      title: '系统消息',
      type: 'system',
      data
    });
  }
}

module.exports = new Notice();
