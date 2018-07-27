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
   * 生成行为
   *
   * @static
   * @param {String} type
   * @param {ObjectId} author_id
   * @param {ObjectId} target_id
   */
  static async setAction(type, author_id, target_id) {
    let action = await ActionModel.findOne({ type, author_id, target_id });
    if (action) {
      action.is_un = !action.is_un;
      await action.save();
    } else {
      action = await this.createAction(type, author_id, target_id);
    }
    return action;
  }

  /**
   * 查询一个行为
   *
   * @static
   * @param {String} type
   * @param {ObjectId} author_id
   * @param {ObjectId} target_id
   */
  static async getAction(type, author_id, target_id) {
    return ActionModel.findOne({ type, author_id, target_id });
  }

  /**
   * 根据条件查询一些行为
   *
   * @static
   * @param {Object} query
   * @param {String} select
   * @param {Object} option
   * @returns
   */
  static async getActionByQuery(query, select, option) {
    return ActionModel.find(query, select, option);
  }
};
