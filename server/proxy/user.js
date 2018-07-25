const UserModel = require('../models/user');

class UserProxy {
  /**
   * 根据用户昵称查找用户
   *
   * @param {String} nickname
   * @memberof UserProxy
   */
  getUserByNickName(nickname) {
    return UserModel.findOne({ nickname });
  }

  /**
   * 根据手机号查找用户
   *
   * @param {*} mobile
   * @returns
   * @memberof UserProxy
   */
  getUserByMobile(mobile) {
    return UserModel.findOne({ mobile });
  }

  /**
   * 根据用户ID查找用户
   *
   * @param {ObjectId} id
   * @returns
   * @memberof UserProxy
   */
  getUserById(id) {
    return UserModel.findById(id);
  }

  /**
   * 创建一个用户
   *
   * @param {Number} mobile
   * @param {String} password
   * @param {String} nickname
   * @returns
   * @memberof UserProxy
   */
  createUser(mobile, password, nickname) {
    return UserModel.create({ mobile, password, nickname });
  }

  /**
   * 根据ID删除用户
   *
   * @param {ObjectId} id
   * @returns
   * @memberof UserProxy
   */
  deleteUserById(id) {
    return UserModel.findByIdAndRemove(id);
  }

  /**
   * 根据手机号删除用户
   *
   * @param {Number} mobile
   * @memberof UserProxy
   */
  deleteUserByMobile(mobile) {
    return UserModel.findOneAndRemove({ mobile });
  }
}

module.exports = new UserProxy();
