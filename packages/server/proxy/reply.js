const ReplyModel = require('../models/reply');

module.exports = class Reply {
  /**
   * 创建回复
   *
   * @static
   * @param {Object} reply
   * @returns
   */
  static create(reply) {
    return ReplyModel.create(reply);
  }

  /**
   * 删除回复
   *
   * @static
   * @param {Object} conditions
   * @returns
   */
  static delete(conditions) {
    return ReplyModel.deleteMany(conditions);
  }
};
