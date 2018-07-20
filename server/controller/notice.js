const BaseComponent = require('../prototype/BaseComponent');
const NoticeModel = require('../models/notice');
const UserModel = require('../models/user');
const TopicModel = require('../models/topic');
const ReplyModel = require('../models/reply');

class Notice extends BaseComponent {
  constructor() {
    super();
    this.getUserNotice = this.getUserNotice.bind(this);
  }

  // 转化消息格式
  async normalNotice(item) {
    const author = await UserModel.findById(item.author_id, 'id nickname avatar');
    const topic = await TopicModel.findById(item.topic_id, 'id title');
    const reply = await ReplyModel.findById(item.reply_id, 'id content');
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

    const userNotices = await NoticeModel.find({ target_id: id }, '', {
      nor: [{ type: 'system' }]
    });

    const result = await Promise.all(userNotices.map(item => (
      new Promise(resolve => {
        resolve(this.normalNotice(item.toObject({ virtuals: true })));
      })
    )));

    return res.send({
      status: 1,
      data: result
    });
  }

  // 获取系统消息
  async getSystemNotice(req, res) {
    const { id } = req.session.user;

    const systemNotices = await NoticeModel.find({ target_id: id, type: 'system' });

    return res.send({
      status: 1,
      data: systemNotices
    });
  }
}

module.exports = new Notice();
