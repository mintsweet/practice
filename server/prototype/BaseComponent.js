const BehaviorModel = require('../models/behavior');
const NoticeModel = require('../models/notice');

module.exports = class BaseComponent {
  async createBehavior(type, author_id, target_id) {
    await BehaviorModel.create({ type, author_id, target_id });
  }

  async findOneBehavior(type, author_id, target_id) {
    return await BehaviorModel.findOne({ type, author_id, target_id });
  }

  // 系统发送了消息给你(target_id)
  async sendSystemNotice(target_id) {
    await NoticeModel.create({ type: 'system', target_id });
  }

  // 谁(author_id)喜欢了你(target_id)的话题(topic_id)
  async sendLikeNotice(author_id, target_id, topic_id) {
    await NoticeModel.create({ type: 'like', author_id, target_id, topic_id });
  }

  // 谁(author_id)收藏了你(target_id)的话题(topic_id)
  async sendCollectNotice(author_id, target_id, topic_id) {
    await NoticeModel.create({ type: 'collect', author_id, target_id, topic_id });
  }

  // 谁(author_id)回复了你(target_id)的话题(topic_id)
  async sendReplyNotice(author_id, target_id, topic_id) {
    await NoticeModel.create({ type: 'reply', author_id, target_id, topic_id });
  }

  // 谁(author_id)回复了你(target_id)在话题(topic_id)中的回复(reply_id)
  async sendReply2Notice(author_id, target_id, topic_id, reply_id) {
    await NoticeModel.create({ type: 'reply2', author_id, target_id, topic_id, reply_id });
  }

  // 谁(author_id)关注了你(target_id)
  async sendFollowNotice(author_id, target_id) {
    await NoticeModel.create({ type: 'follow', author_id, target_id });
  }
}
