const Base = require('./base');
const NoticeProxy = require('../proxy/notice');
const UserProxy = require('../proxy/user');
const TopicProxy = require('../proxy/topic');
const ReplyProxy = require('../proxy/reply');

class Notice extends Base {
  constructor() {
    super();
    this.getUserNotice = this.getUserNotice.bind(this);
  }

  // 转化消息格式
  async normalNotice(item) {
    const author = await UserProxy.getUserById(item.author_id, 'id nickname avatar');
    const topic = await TopicProxy.getTopicById(item.topic_id, 'id title');
    const reply = await ReplyProxy.getReplyById(item.reply_id, 'id content');
    return {
      author,
      topic,
      reply,
      type: item.type,
      typeName: item.typeName,
      create_at: item.create_at
    };
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

    const notice = await NoticeProxy.getNoticeByQuery(query, '', option);

    const data = await Promise.all(notice.map(item => (
      new Promise(resolve => {
        resolve(this.normalNotice(item.toObject({ virtuals: true })));
      })
    )));

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

    return res.send({
      status: 1,
      data: notices
    });
  }
}

module.exports = new Notice();
