const { getUserNotice, getSystemNotice } = require('../http/api');

class Notice {
  // 用户消息
  async renderNoticeUser(req, res) {
    const response = await getUserNotice(req.app.locals.user.id);

    if (response.status === 1) {
      const data = response.data.map(item => {
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
    } else {
      return res.redirect('/exception/500');
    }
  }

  // 系统消息
  async renderNoticeSystem(req, res) {
    const response = await getSystemNotice(req.app.locals.user.id);

    if (response.status === 1) {
      return res.render('site/notice', {
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
