const BaseComponent = require('../prototype/BaseComponent');
const NoticeModel = require('../models/notice');
const UserModel = require('../models/user');
const TopicModel = require('../models/topic');
const ReplyModel = require('../models/reply');
const logger = require('../utils/logger');

class Notice extends BaseComponent {
  constructor() {
    super();
    this.getUserNotice = this.getUserNotice.bind(this);
  }

  // 转化消息格式
  async normalNotice(item) {
    const author = await UserModel.findById(item.author_id, '_id nickname');
    const topic = await TopicModel.findById(item.topic_id, '_id title');
    const reply = await ReplyModel.findById(item.reply_id, '_id content');
    return {
      author,
      topic,
      reply,
      type: item.type,
      has_read: item.has_read,
      create_at: item.create_at
    };
  }

  // 获取用户消息
  async getUserNotice(req, res) {
    const { id } = req.session.userInfo;

    try {
      const userNotices = await NoticeModel.find({ target_id: id }, '', {
        nor: [{ type: 'system' }]
      });
      const result = await Promise.all(userNotices.map(item => (
        new Promise(resolve => {
          resolve(this.normalNotice(item));
        })
      )));

      return res.send({
        status: 1,
        data: result
      });
    } catch(err) {
      logger.error(err.message);
      return res.send({
        status: 0,
        type: 'ERROR_SERVICE',
        message: '服务器无响应，请稍后重试'
      });
    }
  }

  // 获取系统消息
  async getSystemNotice(req, res) {
    const { id } = req.session.userInfo;
    try {
      const systemNotices = await NoticeModel.find({ target_id: id, type: 'system' });
      const result = await Promise.all(systemNotices.map(item => (
        new Promise(resolve => {
          resolve(this.normalNotice(item));
        })
      )));

      return res.send({
        status: 1,
        data: result
      });
    } catch(err) {
      logger.error(err.message);
      return res.send({
        status: 0,
        type: 'ERROR_SERVICE',
        message: '服务器无响应，请稍后重试'
      });
    }
  }
}

module.exports = new Notice();
