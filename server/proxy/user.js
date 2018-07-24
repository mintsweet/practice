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
   * 根据用户ID查找用户
   *
   * @param {String} id
   * @returns
   * @memberof UserProxy
   */
  getUserById(id) {
    return UserModel.findById(id);
  }

  getUserByMobile(mobile) {
    return UserModel.findOne({ mobile });
  }
}

module.exports = new UserProxy();
