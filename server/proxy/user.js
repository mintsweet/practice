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
   * 查找星标用户
   *
   * @static
   * @returns
   */
  static getUserStar() {
    return UserModel.find({ star: true }, 'id avatar nickname location signature star');
  }

  /**
   * 查找积分榜前一百用户
   *
   * @static
   * @returns
   */
  static getUserTop100() {
    return UserModel.find({}, 'id nickname score avatar topic_count star_count collect_count follower_count', {
      limit: 100,
      sort: '-score'
    });
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
};
