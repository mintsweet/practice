const UserModel = require('../models/user');

module.exports = class User {
  /**
   * 根据条件查找用户一个
   *
   * @static
   * @param {Object} query
   * @param {String} select
   * @param {Object} option
   * @returns
   */
  static getUserByQueryOne(query, select, option) {
    return UserModel.findOne(query, select, option);
  }

  /**
   * 根据ID查找用户
   *
   * @static
   * @param {ObjectId} id
   * @param {String} select
   * @param {Object} option
   * @returns
   */
  static getUserById(id, select, option) {
    return UserModel.findById(id, select, option);
  }

  /**
   * 创建用户
   *
   * @static
   * @param {String} email
   * @param {String} password
   * @param {String} nickname
   * @param {Object} restProps
   * @returns
   */
  static createUser(email, password, nickname, restProps) {
    return UserModel.create({ email, password, nickname, ...restProps });
  }

  /**
   * 根据条件删除用户
   *
   * @static
   * @param {Object} query
   * @returns
   */
  static deleteUserByQuery(query) {
    return UserModel.deleteMany(query);
  }
};
