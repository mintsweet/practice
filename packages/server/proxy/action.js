const ActionModel = require('../models/action');

module.exports = class Action {
  /**
   * 创建行为
   *
   * @static
   * @param {String} type
   * @param {ObjectId} author_id
   * @param {ObjectId} target_id
   * @returns
   */
  static createAction(type, author_id, target_id) {
    return ActionModel.create({ type, author_id, target_id });
  }

  /**
   * 删除行为
   * @static
   * @param {Object} query
   */
  static delete(query) {
    return ActionModel.deleteMany(query);
  }
};
