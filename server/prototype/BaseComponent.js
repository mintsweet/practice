const BehaviorModel = require('../models/behavior');
const NoticeModel = require('../models/notice');

module.exports = class BaseComponent {
  // 创建行为
  async createBehavior(type, author_id, target_id) {
    const behavior = await BehaviorModel.create({ type, author_id, target_id });
    return behavior;
  }

  // 系统发送了消息给你(target_id)
  async sendSystemNotice(target_id) {
    await NoticeModel.create({ type: 'system', target_id });
  }

  // 谁(author_id)喜欢了你(target_id)的话题(topic_id)
  async sendLikeNotice(author_id, target_id, topic_id) {
    await NoticeModel.findOneAndUpdate({ type: 'like', author_id, target_id, topic_id }, {
      has_read: false, create_at: Date.now()
    }, {
      upsert: true
    });
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

  // 谁(author_id)点赞了你(target_id)的回复(reply_id)
  async sendUpsNotice(author_id, target_id, reply_id) {
    await NoticeModel.create({ type: 'ups', author_id, target_id, reply_id });
  }
};
