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
  static create(type, author_id, target_id) {
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

  /**
   * 更新行为
   *
   * @static
   * @param {String} type
   * @param {ObjectId} author_id
   * @param {ObjectId} target_id
   */
  static async update(type, author_id, target_id) {
    const action = await ActionModel.findOne({ type, author_id, target_id });
    action.is_un = !action.is_un;
    await action.save();
  }

};
