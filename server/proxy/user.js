const UserModel = require('../models/user');

module.exports = class User {
  /**
   * 根据ID查找用户
   *
   * @static
   * @param {ObjectId} id
   * @returns
   */
  static async getUserById(id, select, option) {
    const user = await UserModel.findById(id, select, option);
    return user;
  }

  /**
   * 根据手机号查找用户
   *
   * @static
   * @param {Number} mobile
   * @returns
   */
  static async getUserByMobile(mobile, select, option) {
    const user = await UserModel.findOne({ mobile }, select, option);
    return user;
  }

  /**
   * 根据昵称查找用户
   *
   * @static
   * @param {String} nickname
   * @returns
   */
  static async getUserByNickname(nickname, select = null, option) {
    const user = await UserModel.findOne({ nickname }, select, option);
    return user;
  }

  /**
   * 根据条件查询用户
   *
   * @static
   * @param {*} query
   * @param {*} option
   * @returns
   */
  static async getUsersByQuery(query, select = null, option) {
    const users = await UserModel.find(query, select, option);
    return users;
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
  static async createUser(mobile, password, nickname) {
    const user = await UserModel.create({ mobile, password, nickname });
    return user;
  }

  /**
   * 根据ID更新用户信息
   *
   * @static
   * @param {ObjectId} id
   * @param {Object} update
   * @returns
   */
  static async updateUserById(id, update, option) {
    const user = await UserModel.findByIdAndUpdate(id, update, option);
    return user;
  }

  /**
   * 根据mobile移除用户
   *
   * @static
   * @param {ObjectId} id
   */
  static async removeUserByMobile(mobile) {
    await UserModel.findOneAndRemove(mobile);
  }
};
