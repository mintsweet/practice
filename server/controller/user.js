const formidable = require('formidable');
const bcrypt = require('bcryptjs');
const BaseComponent = require('../prototype/BaseComponent');
const UserModel = require('../models/user');
const BehaviorModel = require('../models/behavior');
const TopicModel = require('../models/topic');
const ReplyModel = require('../models/reply');
const logger = require('../utils/logger');

const SALT_WORK_FACTOR = 10;

class User extends BaseComponent {
  constructor() {
    super();
    this.signup = this.signup.bind(this);
    this.forgetPass = this.forgetPass.bind(this);
    this.updatePass = this.updatePass.bind(this);
    this.getUserLikes = this.getUserLikes.bind(this);
    this.followOrUnfollowUser = this.followOrUnfollowUser.bind(this);
  }

  // 注册
  signup(req, res) {
    const form = new formidable.IncomingForm();
    form.parse(req, async (error, fields) => {
      if (error) {
        logger.error(error.message);
        return res.send({
          status: 0,
          type: 'ERROR_PARMAS',
          message: '参数解析失败'
        });
      }

      const sms_code = req.session.sms_code || {};
      const { nickname, mobile, password, smscaptcha } = fields;

      try {
        if (!mobile || !/^1[3,5,7,8,9]\w{9}$/.test(mobile)) {
          throw new Error('请输入正确的手机号');
        } else if (!password || !/(?!^(\d+|[a-zA-Z]+|[~!@#$%^&*?]+)$)^[\w~!@#$%^&*?].{6,18}/.test(password)) {
          throw new Error('密码必须为数字、字母和特殊字符其中两种组成并且在6-18位之间');
        } else if (!nickname || nickname.length > 8 || nickname.length < 2) {
          throw new Error('请输入2-8位的昵称');
        } else if (sms_code.mobile !== mobile) {
          throw new Error('收取验证码的手机与登录手机不匹配');
        } else if (sms_code.code !== smscaptcha) {
          throw new Error('短信验证码不正确');
        } else if (Date.now() > sms_code.expired) {
          throw new Error('短信验证码已经失效了，请重新获取');
        }
      } catch(err) {
        return res.send({
          status: 0,
          type: 'ERROR_PARMAS_OF_SIGNUP',
          message: err.message
        });
      }

      try {
        let existUser;

        existUser = await UserModel.findOne({ mobile });
        if (existUser) {
          return res.send({
            status: 0,
            type: 'MOBILE_HAS_BEEN_REGISTERED',
            message: '手机号已经注册过了'
          });
        }

        existUser = await UserModel.findOne({ nickname });
        if (existUser) {
          return res.send({
            status: 0,
            type: 'NICKNAME_HAS_BEEN_REGISTERED',
            message: '昵称已经注册过了'
          });
        }

        const bcryptPassword = await this.encryption(password);
        const _user = {
          nickname,
          mobile,
          password: bcryptPassword
        };

        await UserModel.create(_user);
        return res.send({
          status: 1
        });
      } catch(err) {
        logger.error(err.message);
        return res.send({
          status: 0,
          type: 'ERROR_SERVICE',
          message: '服务器无响应，请稍后重试'
        });
      }
    });
  }

  async encryption(password) {
    const salt = await bcrypt.genSalt(SALT_WORK_FACTOR);
    const hash = await bcrypt.hash(password, salt);
    return hash;
  }

  // 登录
  signin(req, res) {
    const form = new formidable.IncomingForm();
    form.parse(req, async (error, fields) => {
      if (error) {
        logger.error(error.message);
        return res.send({
          status: 0,
          type: 'ERROR_PARMAS',
          message: '参数解析失败'
        });
      }

      const { mobile, password, issms, smscaptcha } = fields;

      try {
        if (!mobile || !/^1[3,5,7,8,9]\w{9}$/.test(mobile)) {
          throw new Error('请输入正确的手机号');
        }
      } catch(err) {
        return res.send({
          status: 0,
          type: 'ERROR_PARMAS_OF_SIGNIN',
          message: err.message
        });
      }

      try {
        const existUser = await UserModel.findOne({ mobile });

        if (!existUser) {
          return res.send({
            status: 0,
            type: 'ERROR_USER_IS_NOT_EXITS',
            message: '尚未注册'
          });
        }

        if (issms) {
          const sms_code = req.session.sms_code || {};

          if (sms_code.mobile !== mobile) {
            return res.send({
              status: 0,
              type: 'ERROR_PARAMS_OF_SIGNIN',
              message: '收取验证码的手机与登录手机不匹配'
            });
          } else if (sms_code.code !== smscaptcha) {
            return res.send({
              status: 0,
              type: 'ERROR_PARAMS_OF_SIGNIN',
              message: '短信验证码不正确'
            });
          } else if (Date.now() > sms_code.expired) {
            return res.send({
              status: 0,
              type: 'ERROR_PARAMS_OF_SIGNIN',
              message: '短信验证码已经失效了，请重新获取'
            });
          }

          req.session.userInfo = existUser;
          return res.send({
            status: 1,
            data: existUser
          });
        } else {
          const isMatch = await bcrypt.compare(password, existUser.password);

          if (!isMatch) {
            return res.send({
              status: 0,
              type: 'ERROR_PASS_IS_NOT_MATCH',
              message: '用户密码错误'
            });
          }

          req.session.userInfo = existUser;
          return res.send({
            status: 1,
            data: existUser
          });
        }
      } catch(err) {
        logger.error(err.message);
        return res.send({
          status: 0,
          type: 'ERROR_SERVICE',
          message: '服务器无响应，请稍后重试'
        });
      }
    });
  }

  // 登出
  signout(req, res) {
    req.session.userInfo = null;
    res.send({
      status: 1
    });
  }

  // 忘记密码
  forgetPass(req, res) {
    const form = new formidable.IncomingForm();
    form.parse(req, async (error, fields) => {
      if (error) {
        logger.error(error.message);
        return res.send({
          status: 0,
          type: 'ERROR_PARMAS',
          message: '参数解析失败'
        });
      }

      const sms_code = req.session.sms_code || {};
      const { mobile, newPassword, smscaptcha } = fields;

      try {
        if (!mobile || !/^1[3,5,7,8,9]\w{9}$/.test(mobile)) {
          throw new Error('请输入正确的手机号');
        } else if (!newPassword || !/(?!^(\d+|[a-zA-Z]+|[~!@#$%^&*?]+)$)^[\w~!@#$%^&*?].{6,18}/.test(newPassword)) {
          throw new Error('密码必须为数字、字母和特殊字符其中两种组成并且在6-18位之间');
        } else if (mobile !== sms_code.mobile) {
          throw new Error('提交手机号与获取验证码手机号不对应');
        } else if (sms_code.code !== smscaptcha) {
          throw new Error('验证码错误');
        } else if (Date.now() > sms_code.expired) {
          throw new Error('验证码已失效，请重新获取');
        }
      } catch(err) {
        return res.send({
          status: 0,
          type: 'ERROR_PARMAS_OF_FORGET_PASS',
          message: err.message
        });
      }

      try {
        const existUser = await UserModel.findOne({ mobile });

        if (!existUser) {
          return res.send({
            status: 0,
            type: 'ERROR_USER_IS_NOT_EXITS',
            message: '尚未注册'
          });
        }

        const bcryptPassword = await this.encryption(newPassword);
        existUser.password = bcryptPassword;
        await existUser.save();

        return res.send({
          status: 1
        });
      } catch(err) {
        logger.error(err.message);
        return res.send({
          status: 0,
          type: 'ERROR_SERVICE',
          message: '服务器无响应，请稍后重试'
        });
      }
    });
  }

  // 获取当前用户信息
  getUserInfo(req, res) {
    const { userInfo } = req.session;
    return res.send({
      status: 1,
      data: userInfo
    });
  }

  // 更新个人信息
  updateUserInfo(req, res) {
    const form = new formidable.IncomingForm();
    form.parse(req, async (error, fields) => {
      if (error) {
        logger.error(error.message);
        return res.send({
          status: 0,
          type: 'ERROR_PARMAS',
          message: '参数解析失败'
        });
      }

      const { id } = req.session.userInfo;
      const { nickname } = fields;

      try {
        const existUser = await UserModel.findOne({ nickname });
        if (existUser) {
          return res.send({
            status: 0,
            type: 'NICKNAME_HAS_BEEN_REGISTERED',
            message: '昵称已经注册过了'
          });
        }

        const doc = await UserModel.findByIdAndUpdate(id, { ...fields });

        req.session.userInfo = doc.toObject();
        return res.send({
          status: 1
        });
      } catch(err) {
        logger.error(err.message);
        return res.send({
          status: 0,
          type: 'ERROR_SERVICE',
          message: '服务器无响应，请稍后重试'
        });
      }
    });
  }

  // 修改密码
  updatePass(req, res) {
    const form = new formidable.IncomingForm();
    form.parse(req, async (error, fields) => {
      if (error) {
        logger.error(error.message);
        return res.send({
          status: 0,
          type: 'ERROR_PARMAS',
          message: '参数解析失败'
        });
      }

      const { id } = req.session.userInfo;
      const { oldPass, newPass } = fields;

      try {
        if (!oldPass) {
          throw new Error('旧密码不能为空');
        } else if (!newPass || !/(?!^(\d+|[a-zA-Z]+|[~!@#$%^&*?]+)$)^[\w~!@#$%^&*?].{6,18}/.test(newPass)) {
          throw new Error('密码必须为数字、字母和特殊字符其中两种组成并且在6-18位之间');
        }
      } catch(err) {
        return res.send({
          status: 0,
          type: 'ERROR_PARMAS_OF_UPDATE_PASS',
          message: err.message
        });
      }

      try {
        const existUser = await UserModel.findById(id);
        const isMatch = await bcrypt.compare(oldPass, existUser.password);

        if (isMatch) {
          const bcryptPassword = await this.encryption(newPass);
          existUser.password = bcryptPassword;
          await existUser.save();

          return res.send({
            status: 1
          });
        } else {
          return res.send({
            status: 0,
            type: 'ERROR_PASSWORD_IS_NOT_MATCH',
            message: '密码错误'
          });
        }
      } catch(err) {
        logger.error(err.message);
        return res.send({
          status: 0,
          type: 'ERROR_SERVICE',
          message: '服务器无响应，请稍后重试'
        });
      }
    });
  }

  // 获取星标用户列表
  async getStarList(req, res) {
    try {
      const userList = await UserModel.find({ is_start: true }, 'id nickname score');
      return res.send({
        status: 1,
        data: userList
      });
    } catch(err) {
      logger.error(err.message);
      return res.send({
        status: 0,
        type: 'ERROR_SERVICE',
        message: '服务器无响应，请稍后重试'
      });
    }
  }

  // 获取积分榜前一百用户
  async getTop100(req, res) {
    try {
      const userList = await UserModel.find({}, 'id nickname score', {
        limit: 100,
        sort: '-score'
      });

      return res.send({
        status: 1,
        data: userList
      });
    } catch(err) {
      logger.error(err.message);
      return res.send({
        status: 0,
        type: 'ERROR_SERVICE',
        message: '服务器无响应，请稍后重试'
      });
    }
  }

  // 根据ID获取用户信息
  async getInfoById(req, res) {
    const { uid } = req.params;

    try {
      const currentUser = await UserModel.findById(uid);

      if (!currentUser) {
        return res.send({
          status: 0,
          type: 'ERROR_ID_IS_INVALID',
          message: '无效的ID'
        });
      }

      const userInfo = req.session.userInfo || {};
      let isFollow;

      if (userInfo.id) {
        const behavior = BehaviorModel.findOne({ type: 'follow', author_id: userInfo.id, target_id: uid });
        if (behavior && behavior.delete) {
          isFollow = true;
        } else {
          isFollow = false;
        }
      } else {
        isFollow = false;
      }

      return res.send({
        status: 1,
        data: currentUser,
        isFollow
      });
    } catch(err) {
      logger.error(err.message);
      return res.send({
        status: 0,
        type: 'ERROR_SERVICE',
        message: '服务器无响应，请稍后重试'
      });
    }
  }

  // 关注或者取消关注某个用户
  async followOrUnfollowUser(req, res) {
    const { uid } = req.params;
    const { id } = req.session.userInfo;

    try {
      const currentFollow = await UserModel.findById(uid);
      const currentAuthor = await UserModel.findById(id);

      if (!currentFollow) {
        return res.send({
          status: 0,
          type: 'ERROR_ID_IS_INVALID',
          message: '无效的ID'
        });
      }

      let behavior;

      behavior = await BehaviorModel.findOne({ type: 'follow', author_id: id, target_id: uid });

      if (behavior) {
        behavior.delete = !behavior.delete;
        behavior = await behavior.save();
      } else {
        behavior = await this.createBehavior('follow', id, uid);
      }

      if (behavior.delete) {
        currentFollow.follower_count -= 1;
        currentFollow.save();
        currentAuthor.following_count -= 1;
        currentAuthor.save();
        req.session.userInfo.following_count -= 1;
      } else {
        currentFollow.follower_count += 1;
        currentFollow.save();
        currentAuthor.following_count += 1;
        currentAuthor.save();
        req.session.userInfo.following_count += 1;
        // 发送提醒 notice
        await this.sendFollowNotice(id, uid);
      }

      return res.send({
        status: 1,
        type: behavior.delete ? 'un_follow' : 'follow'
      });
    } catch(err) {
      logger.error(err);
      return res.send({
        status: 0,
        type: 'ERROR_SERVICE',
        message: '服务器无响应，请稍后重试'
      });
    }
  }

  // 获取用户动态
  async getUserBehaviors(req, res) {
    const { uid } = req.params;
    try {
      const behaviors = await BehaviorModel.find({ author_id: uid });
      const result = await Promise.all(behaviors.map(item => {
        return new Promise(resolve => {
          if (item.type === 'follow') {
            resolve(UserModel.findById(item.target_id, 'id nickname'));
          } else if (item.type === 'ups') {
            resolve(ReplyModel.findById(item.target_id, 'id'));
          } else {
            resolve(TopicModel.findById(item.target_id, 'id title'));
          }
        });
      }));

      const data = behaviors.map((item, i) => {
        return { ...result[i].toObject(), type: item.type };
      });

      return res.send({
        status: 1,
        data
      });
    } catch(err) {
      logger.error(err);
      return res.send({
        status: 0,
        type: 'ERROR_SERVICE',
        message: '服务器无响应，请稍后重试'
      });
    }
  }

  // 获取用户喜欢列表
  async getUserLikes(req, res) {
    const { uid } = req.params;
    try {
      const likeBehavior = await BehaviorModel.find({ type: 'like', author_id: uid, delete: false });
      const likeTopicIds = likeBehavior.map(item => item.target_id.toString());
      const result = await Promise.all(likeTopicIds.map(item => {
        return new Promise(resolve => {
          resolve(TopicModel.findById(item, 'id title'));
        });
      }));

      return res.send({
        status: 1,
        data: result
      });
    } catch(err) {
      logger.error(err);
      return res.send({
        status: 0,
        type: 'ERROR_SERVICE',
        message: '服务器无响应，请稍后重试'
      });
    }
  }

  // 获取用户收藏列表
  async getUserCollections(req, res) {
    const { uid } = req.params;
    try {
      const collectBehavior = await BehaviorModel.find({ type: 'collect', author_id: uid, delete: false });
      const collectTopicIds = collectBehavior.map(item => item.target_id.toString());
      const result = await Promise.all(collectTopicIds.map(item => {
        return new Promise(resolve => {
          resolve(TopicModel.findById(item));
        });
      }));

      return res.send({
        status: 1,
        data: result
      });
    } catch(err) {
      logger.error(err);
      return res.send({
        status: 0,
        type: 'ERROR_SERVICE',
        message: '服务器无响应，请稍后重试'
      });
    }
  }

  // 用户回复的列表
  async getUserReplies(req, res) {
    const { uid } = req.params;

    try {
      const replies = await ReplyModel.find({ author_id: uid });
      const topics = await Promise.all(replies.map(item => {
        return new Promise(resolve => {
          resolve(TopicModel.findById(item.topic_id, 'id title'));
        });
      }));

      const result = replies.map((item, i) => {
        return { ...item.toObject(), topic: topics[i] };
      });

      return res.send({
        status: 1,
        data: result
      });
    } catch(err) {
      logger.error(err);
      return res.send({
        status: 0,
        type: 'ERROR_SERVICE',
        message: '服务器无响应，请稍后重试'
      });
    }
  }

  // 获取用户粉丝列表
  async getUserFollower(req, res) {
    const { uid } = req.params;
    try {
      const followerBehavior = await BehaviorModel.find({ type: 'follow', target_id: uid, delete: false });
      const result = await Promise.all(followerBehavior.map(item => {
        return new Promise(resolve => {
          resolve(UserModel.findById(item.author_id, '_id nickname avatar'));
        });
      }));

      return res.send({
        status: 1,
        data: result
      });
    } catch(err) {
      logger.error(err);
      return res.send({
        status: 0,
        type: 'ERROR_SERVICE',
        message: '服务器无响应，请稍后重试'
      });
    }
  }

  // 获取用户关注的人列表
  async getUserFollowing(req, res) {
    const { uid } = req.params;
    try {
      const followingBehavior = await BehaviorModel.find({ type: 'follow', author_id: uid, delete: false });
      const result = await Promise.all(followingBehavior.map(item => {
        return new Promise(resolve => {
          resolve(UserModel.findById(item.target_id, '_id nickname avatar'));
        });
      }));

      return res.send({
        status: 1,
        data: result
      });
    } catch(err) {
      logger.error(err);
      return res.send({
        status: 0,
        type: 'ERROR_SERVICE',
        message: '服务器无响应，请稍后重试'
      });
    }
  }
}

module.exports = new User();
