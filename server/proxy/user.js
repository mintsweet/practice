const UserModel = require('../models/user');
const ActionProxy = require('./action');
const TopicProxy = require('./topic');
const NoticeProxy = require('./notice');

module.exports = class User {
  /**
   * 根据ID查找用户
   *
   * @static
   * @param {ObjectId} id
   * @returns
   */
  static async getUserById(id, select = null, option) {
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
  static async getUserByMobile(mobile, select = null, option) {
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

  /**
   * 判断用户是否关注用户
   *
   * @static
   * @param {String} type
   * @param {ObjectId} author_id
   * @param {ObjectId} target_id
   * @returns
   */
  static async userIsFollow(type, author_id, target_id) {
    const action = await ActionProxy.getAction(type, author_id, target_id);
    if (action && action.is_un === false) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * 获取用户动态
   *
   * @static
   * @param {ObjectId} uid
   * @returns
   */
  static async getUserActions(uid) {
    const actions = await ActionProxy.getActionByQuery({ author_id: uid, is_un: false });

    const result = await Promise.all(actions.map(item => {
      return new Promise(resolve => {
        if (item.type === 'follow') {
          resolve(this.getUserById(item.target_id, 'id nickname signature avatar'));
        } else {
          resolve(TopicProxy.getTopicById(item.target_id, 'id title'));
        }
      });
    }));

    const data = actions.map((item, i) => {
      return { ...result[i], type: item.type };
    });

    return data;
  }

  /**
   * 获取用户专栏
   *
   * @static
   * @param {ObjectId} uid
   */
  static async getUserCreates(uid) {
    const actions = await ActionProxy.getActionByQuery({ type: 'create', author_id: uid, is_un: false });

    const data = await Promise.all(actions.map(item => {
      return new Promise(resolve => {
        resolve(TopicProxy.getTopicById(item.target_id, 'id title star_count collect_count visit_count'));
      });
    }));

    return data;
  }

  /**
   * 获取用户喜欢列表
   *
   * @static
   * @param {ObjectId} uid
   * @returns
   */
  static async getUserLikes(uid) {
    const actions = await ActionProxy.getActionByQuery({ type: 'like', author_id: uid, is_un: false });

    const data = await Promise.all(actions.map(item => {
      return new Promise(resolve => {
        resolve(TopicProxy.getTopicById(item.target_id, 'id title'));
      });
    }));

    return data;
  }

  /**
   * 获取用户收藏列表
   *
   * @static
   * @param {ObjectId} uid
   */
  static async getUserCollects(uid) {
    const actions = await ActionProxy.getActionByQuery({ type: 'collect', author_id: uid, is_un: false });

    const data = await Promise.all(actions.map(item => {
      return new Promise(resolve => {
        resolve(TopicProxy.getTopicById(item.target_id, 'id title'));
      });
    }));

    return data;
  }

  /**
   * 获取用户粉丝列表
   *
   * @static
   * @param {ObjectId} uid
   * @returns
   */
  static async getUserFollower(uid) {
    const actions = await ActionProxy.getActionByQuery({ type: 'follow', target_id: uid, is_un: false });

    const data = await Promise.all(actions.map(item => {
      return new Promise(resolve => {
        resolve(this.getUserById(item.author_id, 'id nickname avatar'));
      });
    }));

    return data;
  }

  /**
   * 获取用户关注列表
   *
   * @static
   * @param {ObjectId} uid
   * @returns
   */
  static async getUserFollowing(uid) {
    const actions = await ActionProxy.getActionByQuery({ type: 'follow', author_id: uid, is_un: false });

    const data = await Promise.all(actions.map(item => {
      return new Promise(resolve => {
        resolve(this.getUserById(item.target_id, 'id nickname avatar'));
      });
    }));

    return data;
  }

  static async updateFollowOrUn(author_id, target_id) {
    const action = await ActionProxy.setAction('follow', author_id, target_id);
    const targetUser = await this.getUserById(target_id);
    const authorUser = await this.getUserById(author_id);

    if (action.is_un) {
      targetUser.follower_count -= 1;
      await targetUser.save();
      authorUser.following_count -= 1;
      await authorUser.save();
    } else {
      targetUser.follower_count += 1;
      await targetUser.save();
      authorUser.following_count += 1;
      await authorUser.save();
      await NoticeProxy.createFollowNotice(author_id, target_id);
    }

    return action.toObject({ virtuals: true }).actualType;
  }
};
