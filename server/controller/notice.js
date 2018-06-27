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
    try {
      const { _id } = req.session.userInfo;
      const userNotices = await NoticeModel.find({ target_id: _id }, '', {
        nor: [{ type: 'system' }]
      });

      const result = await Promise.all(userNotices.map(item => {
        return new Promise((resolve, reject) => {
          resolve(this.normalNotice(item));
        });
      }));

      return res.send({
        status: 1,
        data: result
      });
    } catch(err) {
      logger.error(err.message);
      return res.send({
        status: 0,
        type: 'ERROR_GET_ALL_NOTICE',
        message: '获取用户消息失败'
      });
    }
  }

  // 获取系统消息
  async getSystemNotice(req, res) {
    try {
      const { _id } = req.session.userInfo;
      const systemNotices = await NoticeModel.find({ target_id: _id, type: 'system' });
      
      const result = await Promise.all(systemNotices.map(item => {
        return new Promise((resolve, reject) => {
          resolve(this.normalNotice(item));
        });
      }));

      return res.send({
        status: 1,
        data: result
      });
    } catch(err) {
      logger.error(err.message);
      return res.send({
        status: 0,
        type: 'ERROR_GET_ALL_NOTICE',
        message: '获取系统消息失败'
      });
    }
  }
}

module.exports = new Notice();
