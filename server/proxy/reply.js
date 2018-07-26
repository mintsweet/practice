const ReplyModel = require('../models/reply');

module.exports = class Reply {
  /**
   * 根据ID查找一条回复
   *
   * @static
   * @param {ObjectId} rid
   * @returns
   */
  static async getReplyById(rid) {
    const reply = await ReplyModel.findById(rid);
    return reply;
  }

  /**
   * 根据条件查找回复
   *
   * @static
   * @param {Object} query
   * @returns
   */
  static async getReplyByQuery(query) {
    const replys = await ReplyModel.find(query);
    return replys;
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
  static async createReply(content, author_id, topic_id, reply_id) {
    const _reply = {
      content,
      author_id,
      topic_id
    };

    if (reply_id) {
      _reply.reply_id = reply_id;
    }

    const reply = await ReplyModel.create(_reply);
    return reply;
  }

  /**
   * 根据ID删除一条回复
   *
   * @static
   * @param {ObjectId} rid
   */
  static async deleteReplyById(rid) {
    await ReplyModel.findByIdAndRemove(rid);
  }

  /**
   * 根据ID更新一条回复
   *
   * @static
   * @param {ObjectId} rid
   * @param {Object} update
   */
  static async updateReplyById(rid, update) {
    await ReplyModel.findByIdAndUpdate(rid, update);
  }
};
