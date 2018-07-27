const NoticeModel = require('../models/notice');

module.exports = class Notice {
  /**
   * 根据条件查询提醒
   *
   * @static
   * @param {Object} query
   * @param {String} select
   * @param {Object} option
   */
  static getNoticeByQuery(query, select, option) {
    return NoticeModel.find(query, select, option);
  }

  /**
   * 创建一个点赞的提醒
   *
   * @static
   * @param {ObjectId} target_id
   * @param {ObjectId} author_id
   * @param {ObjectId} topic_id
   */
  static createLikeNotice(author_id, target_id, topic_id) {
    return NoticeModel.findOneAndUpdate({ type: 'like', author_id, target_id, topic_id }, { create_at: Date.now() }, { upsert: true });
  }

  /**
   * 创建一个收藏的提醒
   *
   * @static
   * @param {ObjectId} target_id
   * @param {ObjectId} author_id
   * @param {ObjectId} topic_id
   */
  static createCollectNotice(author_id, target_id, topic_id) {
    return NoticeModel.findOneAndUpdate({ type: 'collect', author_id, target_id, topic_id }, { create_at: Date.now() }, { upsert: true });
  }

  /**
   * 创建一个回复的提醒
   *
   * @static
   * @param {ObjectId} author_id
   * @param {ObjectId} target_id
   * @param {ObjectId} topic_id
   */
  static createReplyNotice(author_id, target_id, topic_id) {
    return NoticeModel.create({ type: 'reply', author_id, target_id, topic_id });
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
  static createAtNotice(author_id, target_id, topic_id, reply_id) {
    return NoticeModel.create({ type: 'at', author_id, target_id, topic_id, reply_id });
  }

  /**
   * 创建一个关注的提醒
   *
   * @static
   * @param {ObjectId} author_id
   * @param {ObjectId} target_id
   */
  static createFollowNotice(author_id, target_id) {
    return NoticeModel.findOneAndUpdate({ type: 'follow', author_id, target_id }, { create_at: Date.now() }, { upsert: true });
  }

  /**
   * 创建一个回复点赞的提醒
   *
   * @static
   * @param {ObjectId} author_id
   * @param {ObjectId} target_id
   * @param {ObjectId} reply_id
   */
  static createUpReplyNotice(author_id, target_id, reply_id) {
    return NoticeModel.findOneAndUpdate({ type: 'up', author_id, target_id, reply_id }, { create_at: Date.now() }, { upsert: true });
  }
};
