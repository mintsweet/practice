const API = require('../utils/api');

class Notice {
  async renderNoticeUser(req, res) {
    const { token } = req.session;
    const data = await API.getUserNotice(token);

    res.render(
      'pages/notice',
      {
        title: '用户消息',
        type: 'user',
        data,
      }
    );
  }

  async renderNoticeSystem(req, res) {
    const { token } = req.session;
    const data = await API.getSystemNotice(token);

    res.render(
      'pages/notice',
      {
        title: '系统消息',
        type: 'system',
        data,
      }
    );
  }
}

module.exports = new Notice();
