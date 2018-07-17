const { getUserNotice, getSystemNotice } = require('../http/api');

class Notice {
  // 用户消息
  async renderNoticeUser(req, res) {
    let data = await getUserNotice(req.app.locals.user.id);

    data = data.map(item => {
      let typeName = '';

      switch (item.type) {
        case 'star':
          typeName = '喜欢了';
          break;
        case 'collect':
          typeName = '收藏了';
          break;
        case 'follow':
          typeName = '新的关注者';
          break;
        case 'reply':
        case 'reply2':
          typeName = '回复了';
          break;
        case 'up':
          typeName = '点赞了';
          break;
        default:
          typeName = '';
          break;
      }

      return { ...item, typeName };
    });

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
