const UserModel = require('../models/user');

module.exports = class User {
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
   * 根据手机号查找用户
   *
   * @static
   * @param {Number} mobile
   * @param {String} select
   * @param {Object} option
   * @returns
   */
  static getUserByMobile(mobile, select, option) {
    return UserModel.findOne({ mobile }, select, option);
  }

  /**
   * 根据昵称查找用户
   *
   * @static
   * @param {String} nickname
   * @param {String} select
   * @param {Object} option
   * @returns
   */
  static getUserByNickname(nickname, select, option) {
    return UserModel.findOne({ nickname }, select, option);
  }

  /**
   * 根据条件查询用户
   *
   * @static
   * @param {Object} query
   * @param {String} select
   * @param {Object} option
   * @returns
   */
  static getUsersByQuery(query, select, option) {
    return UserModel.find(query, select, option);
  }

  /**
   * 创建用户
   *
   * @static
   * @param {Number} mobile
   * @param {String} password
   * @param {String} nickname
   * @returns
   */
  static createUser(mobile, password, nickname) {
    return UserModel.create({ mobile, password, nickname });
  }

  /**
   * 根据ID更新用户信息
   *
   * @static
   * @param {ObjectId} id
   * @param {Object} update
   * @param {Object} option
   * @returns
   */
  static updateUserById(id, update, option) {
    return UserModel.findByIdAndUpdate(id, update, option);
  }
};
