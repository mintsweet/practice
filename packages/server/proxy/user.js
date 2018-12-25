const UserModel = require('../models/user');

module.exports = class User {
  /**
   * 创建用户
   *
   * @static
   * @param {Object} user
   * @returns
   */
  static create(user) {
    return UserModel.create(user);
  }

  /**
   * 根据条件删除用户
   *
   * @static
   * @param {Object} conditions
   * @returns
   */
  static delete(conditions) {
    return UserModel.deleteMany(conditions);
  }

  /**
   * 更新用户
   *
   * @static
   * @param {Object} conditions
   * @param {Object} doc
   * @param {Object} options
   * @returns
   */
  static update(conditions, doc, options) {
    return UserModel.updateOne(conditions, doc, options);
  }

  /**
   * 根据ID查找用户
   *
   * @static
   * @param {ObjectId} id
   * @param {Object|String} select
   * @param {Object} options
   * @returns
   */
  static getById(id, select, options) {
    return UserModel.findById(id, select, options);
  }

  /**
   * 根据条件查找用户一个
   *
   * @static
   * @param {Object} query
   * @param {Object|String} select
   * @param {Object} options
   * @returns
   */
  static getOne(query, select, options) {
    return UserModel.findOne(query, select, options);
  }

  /**
   * 根据条件查找用户
   *
   * @static
   * @param {Object} query
   * @param {String} select
   * @param {Object} options
   * @returns
   */
  static get(query, select, options) {
    return UserModel.find(query, select, options);
  }

  /**
   * 根据条件统计话题
   *
   * @static
   * @param {Object} filter
   */
  static async count(filter = {}) {
    return UserModel.countDocuments(filter);
  }
};
