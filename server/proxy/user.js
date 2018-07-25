const UserModel = require('../models/user');

module.exports = class User {
  /**
   * 根据ID查找用户
   *
   * @static
   * @param {ObjectId} id
   * @returns
   */
  static getUserById(id, option) {
    return UserModel.findById(id, option);
  }

  /**
   * 根据手机号查找用户
   *
   * @static
   * @param {Number} mobile
   * @returns
   */
  static getUserByMobile(mobile) {
    return UserModel.findOne({ mobile });
  }

  /**
   * 根据昵称查找用户
   *
   * @static
   * @param {String} nickname
   * @returns
   */
  static getUserByNickname(nickname) {
    return UserModel.findOne({ nickname });
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
   * @param {*} id
   * @param {*} condition
   * @returns
   */
  static updateUser(id, condition) {
    return UserModel.findByIdAndUpdate(id, condition);
  }

  /**
   * 根据条件查询用户
   *
   * @static
   * @param {*} query
   * @param {*} option
   * @returns
   */
  static async getUsersByQuery(query, option) {
    const users = await UserModel.find(query, option);
    return users;
  }
};
