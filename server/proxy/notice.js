const NoticeModel = require('../models/notice');

module.exports = class Notice {
  /**
   * 创建一个点赞的提醒
   *
   * @static
   * @param {ObjectId} target_id
   * @param {ObjectId} author_id
   * @param {ObjectId} topic_id
   */
  static async createStarNotice(target_id, author_id, topic_id) {
    await NoticeModel.findOneAndUpdate({ type: 'star', author_id, target_id, topic_id }, { create_at: Date.now() }, { upsert: true });
  }

  /**
   * 创建一个收藏的提醒
   *
   * @static
   * @param {ObjectId} target_id
   * @param {ObjectId} author_id
   * @param {ObjectId} topic_id
   */
  static async createCollectNotice(author_id, target_id, topic_id) {
    await NoticeModel.findOneAndUpdate({ type: 'collect', author_id, target_id, topic_id }, { create_at: Date.now() }, { upsert: true });
  }

  /**
   * 创建一个回复的提醒
   *
   * @static
   * @param {ObjectId} author_id
   * @param {ObjectId} target_id
   * @param {ObjectId} topic_id
   */
  static async createReplyNotice(author_id, target_id, topic_id) {
    await NoticeModel.create({ type: 'reply', author_id, target_id, topic_id });
  }

  /**
   * 创建一个 @ 的提醒
   *
   * @static
   * @param {ObjectId} author_id
   * @param {ObjectId} target_id
   * @param {ObjectId} topic_id
   * @param {ObjectId} reply_id
   */
  static async createAtNotice(author_id, target_id, topic_id, reply_id) {
    await NoticeModel.create({ type: 'at', author_id, target_id, topic_id, reply_id });
  }

  /**
   * 创建一个关注的提醒
   *
   * @static
   * @param {ObjectId} author_id
   * @param {ObjectId} target_id
   */
  static async createFollowNotice(author_id, target_id) {
    await NoticeModel.findOneAndUpdate({ type: 'follow', author_id, target_id }, { create_at: Date.now() }, { upsert: true });
  }

  /**
   * 创建一个回复点赞的提醒
   *
   * @static
   * @param {ObjectId} author_id
   * @param {ObjectId} target_id
   * @param {ObjectId} reply_id
   */
  static async createUpReplyNotice(author_id, target_id, reply_id) {
    await NoticeModel.findOneAndUpdate({ type: 'up', author_id, target_id, reply_id }, { create_at: Date.now() }, { upsert: true });
  }
};
