const ActionModel = require('../models/action');

module.exports = class Action {
  /**
   * 创建行为
   *
   * @static
   * @param {Object} action
   * @returns
   */
  static create(action) {
    return ActionModel.create(action);
  }

  /**
   * 删除行为
   *
   * @static
   * @param {Object} conditions
   * @returns
   */
  static delete(conditions) {
    return ActionModel.deleteMany(conditions);
  }

  /**
   * 更新行为
   *
   * @static
   * @param {Object} conditions
   * @param {Object} doc
   * @param {Object} options
   * @returns
   */
  static update(conditions, doc, options) {
    return ActionModel.updateOne(conditions, doc, options);
  }

  /**
   * 查找行为
   *
   * @static
   * @param {Object} query
   * @param {Object|String} select
   * @param {Object} options
   * @returns
   */
  static getOne(query, select, options) {
    return ActionModel.findOne(query, select, options);
  }

  /**
   * 查找行为
   *
   * @static
   * @param {Object} query
   * @param {Object|String} select
   * @param {Object} options
   * @returns
   */
  static get(query, select, options) {
    return ActionModel.find(query, select, options);
  }
};
