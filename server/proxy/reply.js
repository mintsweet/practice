const ReplyModel = require('../models/reply');

module.exports = class Reply {
  /**
   * 根据ID查找一条回复
   *
   * @static
   * @param {ObjectId} id
   * @param {String} select
   * @param {Object} option
   * @returns
   */
  static getReplyById(id, select, option) {
    return ReplyModel.findById(id, select, option);
  }

  /**
   * 根据条件查找回复
   *
   * @static
   * @param {Object} query
   * @param {String} select
   * @param {Object} option
   * @returns
   */
  static getReplyByQuery(query, select, option) {
    return ReplyModel.find(query, select, option);
  }

  /**
   * 保存一条回复
   *
   * @static
   * @param {String} content
   * @param {ObjectId} author_id
   * @param {ObjectId} topic_id
   * @param {ObjectId} reply_id
   */
  static createReply(content, author_id, topic_id, reply_id) {
    const _reply = {
      content,
      author_id,
      topic_id
    };

    if (reply_id) {
      _reply.reply_id = reply_id;
    }

    return ReplyModel.create(_reply);
  }

  /**
   * 根据ID删除一条回复
   *
   * @static
   * @param {ObjectId} rid
   */
  static deleteReplyById(rid) {
    return ReplyModel.findByIdAndRemove(rid);
  }

  /**
   * 根据ID更新一条回复
   *
   * @static
   * @param {ObjectId} rid
   * @param {Object} update
   */
  static updateReplyById(rid, update) {
    return ReplyModel.findByIdAndUpdate(rid, update);
  }
};
