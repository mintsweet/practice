const NoticeProxy = require('../proxy/notice');
const UserProxy = require('../proxy/user');
const TopicProxy = require('../proxy/topic');
const ReplyProxy = require('../proxy/reply');

class Notice {
  constructor() {
    this.getUserNotice = this.getUserNotice.bind(this);
    this.getSystemNotice = this.getSystemNotice.bind(this);
  }

  // 转化消息格式
  async normalNotice(item) {
    const data = {};

    switch (item.type) {
      case 'like':
        data.author = await UserProxy.getUserById(item.author_id, 'id nickname avatar');
        data.topic = await TopicProxy.getTopicById(item.topic_id, 'id title');
        data.typeName = '喜欢了';
        break;
      case 'collect':
        data.author = await UserProxy.getUserById(item.author_id, 'id nickname avatar');
        data.topic = await TopicProxy.getTopicById(item.topic_id, 'id title');
        data.typeName = '收藏了';
        break;
      case 'follow':
        data.author = await UserProxy.getUserById(item.author_id, 'id nickname avatar');
        data.typeName = '新的关注者';
        break;
      case 'reply':
        data.author = await UserProxy.getUserById(item.author_id, 'id nickname avatar');
        data.topic = await TopicProxy.getTopicById(item.topic_id, 'id title');
        data.typeName = '回复了';
        break;
      case 'at':
        data.author = await UserProxy.getUserById(item.author_id, 'id nickname avatar');
        data.topic = await TopicProxy.getTopicById(item.topic_id, 'id title');
        data.reply = await ReplyProxy.getReplyById(item.reply_id, 'id content');
        data.typeName = '@了';
        break;
      case 'up':
        data.author = await UserProxy.getUserById(item.author_id, 'id nickname avatar');
        data.topic = await TopicProxy.getTopicById(item.topic_id, 'id title');
        data.reply = await ReplyProxy.getReplyById(item.reply_id, 'id content');
        data.typeName = '点赞了';
        break;
      default:
        data.typeName = '系统消息';
        break;
    }

    return data;
  }

  // 获取用户消息
  async getUserNotice(req, res) {
    const { id } = req.session.user;

    const query = {
      target_id: id
    };

    const option = {
      nor: [{ type: 'system' }]
    };

    const notices = await NoticeProxy.getNoticeByQuery(query, '', option);

    const data = await Promise.all(notices.map(item => {
      return new Promise(resolve => {
        resolve(this.normalNotice(item.toObject()));
      });
    }));

    return res.send({
      status: 1,
      data
    });
  }

  // 获取系统消息
  async getSystemNotice(req, res) {
    const { id } = req.session.user;

    const query = {
      target_id: id,
      type: 'system'
    };

    const notices = await NoticeProxy.getNoticeByQuery(query);

    const data = notices.map(item => {
      return this.normalNotice(item.toObject());
    });

    return res.send({
      status: 1,
      data
    });
  }
}

module.exports = new Notice();
