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
    this.getUserLikes = this.getUserLikes.bind(this);
    this.followOrUnfollowUser = this.followOrUnfollowUser.bind(this);
  }

  // 注册
  signup(req, res) {
    const form = new formidable.IncomingForm();
    form.parse(req, async (err, fields, files) => {
      if (err) {
        logger.error(err.message);
        return res.send({
          status: 0,
          type: 'ERROR_PARMAS',
          message: '参数解析失败'
        });
      }

      const { msg_code } = req.session;
      const { nickname, mobile, password, msgcaptcha } = fields;

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
      

      try {
        if (!mobile || !/^1[3,5,7,8,9]\w{9}$/.test(mobile)) {
          throw new Error('请输入正确的手机号');
        } else if (!password || !/(?!^(\d+|[a-zA-Z]+|[~!@#$%^&*?]+)$)^[\w~!@#$%^&*?].{6,18}/.test(password)) {
          throw new Error('密码必须为数字、字母和特殊字符其中两种组成并且在6-18位之间');
        } else if (!nickname || nickname.length > 8 || nickname.length < 2) {
          throw new Error('请输入2-8位的名称');
        } else if (msg_code.mobile !== mobile) {
          throw new Error('收取验证码的手机与登录手机不匹配');
        } else if (msg_code.code !== msgcaptcha) {
          throw new Error('短信验证码不正确')
        } else if ((Date.now() - msg_code.time) / (1000 * 60) > 10) {
          throw new Error('短信验证码已经失效了，请重新获取');
        }
      } catch(err) {
        return res.send({
          status: 0,
          type: 'ERROR_PARMAS_SIGNUP',
          message: err.message
        });
      }

      const bcryptPassword = await this.encryption(password);
      const _user = {
        nickname,
        mobile,
        password: bcryptPassword
      };

      try {
        await UserModel.create(_user);
        return res.send({
          status: 1
        });
      } catch(err) {
        logger.error(err.message);
        return res.send({
          status: 0,
          type: 'ERROR_SERVICE_FAILED',
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
    form.parse(req, async (err, fields, files) => {
      if (err) {
        logger.error(err.message);
        return res.send({
          status: 0,
          type: 'ERROR_PARMAS',
          message: '参数解析失败'
        });
      }

      const { type, mobile, password, msgcaptcha } = fields;

      try {
        if (!type || (type !== 'acc' && type !== 'mct')) {
          throw new Error('请输入正确的登录方式');
        } else if (!mobile || !/^1[3,5,7,8,9]\w{9}$/.test(mobile)) {
          throw new Error('请输入正确的手机号');
        }
      } catch(err) {
        return res.send({
          status: 0,
          type: 'ERROR_SIGNIN_PARMAS',
          message: err.message
        });
      }

      const existUser = await UserModel.findOne({ mobile });

      // if (!existUser) {
      //   return res.send({
      //     status: 0,
      //     type: 'ERROR_USER_IS_NOT_EXITS',
      //     message: '手机账户尚未注册'
      //   });
      // }

      if (type === 'acc') {
        const isMatch = await bcrypt.compare(password, existUser.password);
        if (isMatch) {
          req.session.userInfo = existUser;
          return res.send({
            status: 1,
            data: existUser
          });
        } else {
          return res.send({
            status: 0,
            type: 'ERROR_PASS_IS_NOT_MATCH',
            message: '用户密码错误'
          });
        }
      } else if (type === 'mct') {
        const { msg_code } = req.session;
        try {
          if (msg_code.mobile !== mobile) {
            throw new Error('收取验证码的手机与登录手机不匹配');
          } else if (msg_code.code !== msgcaptcha) {
            throw new Error('短信验证码不正确')
          } else if ((Date.now() - msg_code.time) > 1000) {
            throw new Error('短信验证码已经失效了，请重新获取');
          }
        } catch(err) {
          return res.send({
            status: 0,
            type: 'ERROR_MSG_CAPTCHA',
            message: err.message
          });
        }
        req.session.userInfo = existUser;
        return res.send({
          status: 1,
          data: existUser
        });
      }
    });
  }

  // 登出
  signout(req, res) {
    try {
      req.session.userInfo = null;
      res.send({
        status: 1
      });
    } catch(err) {
      logger.error(err.message);
      return res.send({
        status: 0,
        type: 'ERROR_SERVICE_FAILED',
        message: '服务器无响应，请稍后重试'
      });
    }
  }

  // 忘记密码
  forgetPass(req, res) {
    const form = new formidable.IncomingForm();
    form.parse(req, async (err, fields, files) => {
      if (err) {
        logger.error(err.message);
        return res.send({
          status: 0,
          type: 'ERROR_PARMAS',
          message: '参数解析失败'
        });
      }

      let { msg_code } = req.session;
      msg_code = msg_code || {};
      const { mobile, newPassword, msgcaptcha } = fields;

      try {
        if (mobile && mobile !== msg_code.mobile) {
          throw new Error('提交手机号与获取验证码手机号不对应');
        } else if (!newPassword || !/(?!^(\d+|[a-zA-Z]+|[~!@#$%^&*?]+)$)^[\w~!@#$%^&*?].{6,18}/.test(newPassword)) {
          throw new Error('密码必须为数字、字母和特殊字符其中两种组成并且在6-18位之间');
        } else if (msg_code.code !== msgcaptcha) {
          throw new Error('验证码错误');
        } else if (msg_code.mobile !== mobile) {
          throw new Error('收取验证码的手机与登录手机不匹配');
        } else if ((Date.now() - msg_code.time) / (1000 * 60) > 10) {
          throw new Error('验证码已失效，请重新获取');
        }
      } catch(err) {
        return res.send({
          status: 0,
          type: 'ERROR_PARMAS_OF_FORGET_PASS',
          message: err.message
        });
      }

      const bcryptPassword = await this.encryption(newPassword);
      await UserModel.findOneAndUpdate({ mobile }, {$set: {password: bcryptPassword}});
      return res.send({
        status: 1
      });
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
    form.parse(req, async (err, fields, files) => {
      if (err) {
        return res.send({
          status: 0,
          type: 'ERROR_PARMAS',
          message: '参数解析失败'
        });
      }

      const { _id } = req.session.userInfo;
      const { nickname, avatar, location, signature } = fields;

      const existUser = await UserModel.findOne({ nickname });

      if (existUser) {
        return res.send({
          status: 0,
          type: 'NICKNAME_HAS_BEEN_REGISTERED',
          message: '昵称已经注册过了'
        });
      }

      try {
        const doc = await UserModel.findByIdAndUpdate(_id, { nickname, avatar, location, signature });
        req.session.userInfo = doc.toObject();
        return res.send({
          status: 1
        });
      } catch(err) {
        return res.send({
          status: 0,
          type: 'ERROR_UPDATE_USER_INFO',
          message: err.message
        });
      }
    });
  }

  // 修改密码
  updatePass(req, res) {
    const form = new formidable.IncomingForm();
    form.parse(req, async (err, fields, files) => {
      if (err) {
        return res.send({
          status: 0,
          type: 'ERROR_PARMAS',
          message: '参数解析失败'
        });
      }

      const { _id } = req.session.userInfo;
      const { oldPassword , newPassword } = fields;
      
      try {
        if (!oldPassword) {
          throw new Error('旧密码不能为空');
        } else if (!newPassword || !/(?!^(\d+|[a-zA-Z]+|[~!@#$%^&*?]+)$)^[\w~!@#$%^&*?].{6,18}/.test(newPassword)) {
          throw new Error('密码必须为数字、字母和特殊字符其中两种组成并且在6-18位之间');
        }
      } catch(err) {
        return res.send({
          status: 0,
          type: 'ERROR_FORGET_PARMAS',
          message: err.message
        });
      }
  
      const existUser = await UserModel.findById(_id, '-_id -__v');
      if (!existUser) {
        return res.send({
          status: 0,
          type: 'ERROR_USER_IS_NOT_EXITS',
          message: '手机账户账户不存在'
        });
      }
  
      const isMatch = await bcrypt.compare(oldPassword, existUser.password);
      if (isMatch) {
        const bcryptPassword = await this.encryption(newPassword);
        await UserModel.findByIdAndUpdate(_id, { password: bcryptPassword });
        return res.send({
          status: 1
        });
      } else {
        return res.send({
          status: 0,
          type: 'ERROR_PASSWORD_IS_NOT_MAtCH',
          message: '密码错误'
        });
      }
    });
  }

  // 获取星标用户列表
  async getStartList(req, res) {
    try {
      const userList = await UserModel.find({ is_start: true }, '_id nickname score');
      return res.send({
        status: 1,
        data: userList
      });
    } catch(err) {
      return res.send({
        status: 0,
        type: 'ERROR_GET_START_LIST',
        message: '获取星标用户失败'
      });
    }
  }

  // 获取积分榜前一百用户
  async getTop100(req, res) {
    try {
      const userList = await UserModel.find({}, '_id nickname score', {
        limit: 100,
        sort: '-score'
      });

      return res.send({
        status: 1,
        data: userList
      });
    } catch(err) {
      return res.send({
        status: 0,
        type: 'ERROR_GET_START_LIST',
        message: '获取积分榜前一百用户失败'
      });
    }
  }

  // 根据ID获取用户信息
  async getInfoById(req, res) {
    const { uid } = req.params;

    if (!uid) {
      return res.send({
        status: 0,
        type: 'ERROR_PARAMS',
        message: '无效的Id'
      });
    }

    const user = await UserModel.findById(uid, '-__v -password -mobile -is_admin -role -create_at -update_at -is_block -is_star');

    if (!user) {
      return res.send({
        status: 0,
        type: 'ERROR_USER_NOT_EXSIT',
        message: '用户不存在'
      });
    }

    return res.send({
      status: 1,
      data: user
    });
  }

  // 获取用户喜欢列表
  async getUserLikes(req, res) {
    const { uid } = req.params;
    const likeBehavior = await BehaviorModel.find({ type: 'like', author_id: uid, delete: false });
    const likeTopicIds = likeBehavior.map(item => item.target_id.toString());
    const result = await Promise.all(likeTopicIds.map(item => {
      return new Promise((resolve, reject) => {
        resolve(TopicModel.findById(item));
      });
    }));

    return res.send({
      status: 1,
      data: result
    });
  }

  // 获取用户收藏列表
  async getUserCollections(req, res) {
    const { uid } = req.params;
    const collectBehavior = await BehaviorModel.find({ type: 'collect', author_id: uid, delete: false });
    const collectTopicIds = collectBehavior.map(item => item.target_id.toString());
    const result = await Promise.all(collectTopicIds.map(item => {
      return new Promise((resolve, reject) => {
        resolve(TopicModel.findById(item));
      });
    }));

    return res.send({
      status: 1,
      data: result
    });
  }

  // 用户回复的列表
  async getUserReplies(req, res) {
    const { uid } = req.params;

    if (!uid) {
      return res.send({
        status: 0,
        type: 'ERROR_PARAMS',
        message: '无效的ID'
      });
    }

    const replies = await ReplyModel.find({ author_id: uid });
    const topics = await Promise.all(replies.map(item => {
      return new Promise((resolve, reject) => {
        resolve(TopicModel.findById(item.topic_id, '_id title'));
      });
    }));

    const result = replies.map((item, i) => {
      return { ...item.toObject(), topic: topics[i] }
    });

    return res.send({
      status: 1,
      data: result
    });
  }
  
  // 获取用户粉丝列表
  async getUserFollower(req, res) {
    const { uid } = req.params;

    if (!uid) {
      return res.send({
        status: 0,
        type: 'ERROR_PARAMS',
        message: '无效的ID'
      });
    }

    const followerBehavior = await BehaviorModel.find({ type: 'follow', target_id: uid, delete: false });
    const result = await Promise.all(followerBehavior.map(item => {
      return new Promise((resolve, reject) => {
        resolve(UserModel.findById(item.author_id, '_id nickname avatar'));
      });
    }));

    return res.send({
      status: 1,
      data: result
    });
  }

  // 获取用户关注的人列表
  async getUserFollowing(req, res) {
    const { uid } = req.params;

    if (!uid) {
      return res.send({
        status: 0,
        type: 'ERROR_PARAMS',
        message: '无效的ID'
      });
    }

    const followingBehavior = await BehaviorModel.find({ type: 'follow', author_id: uid, delete: false });
    const result = await Promise.all(followingBehavior.map(item => {
      return new Promise((resolve, reject) => {
        resolve(UserModel.findById(item.target_id, '_id nickname avatar'));
      });
    }));

    return res.send({
      status: 1,
      data: result
    });
  }

  // 关注或者取消关注某个用户
  async followOrUnfollowUser(req, res) {
    const { uid } = req.params;
    const { _id } = req.session.userInfo;

    try {
      let behavior;
      
      behavior = await this.findOneBehavior('follow', _id, uid);
      
      if (behavior) {
        behavior.delete = !behavior.delete;
        behavior = await behavior.save();
      } else {
        behavior = await this.createBehavior('follow', _id, uid);
      }

      const author = await UserModel.findById(_id);
      const follow = await UserModel.findById(uid);

      if (!author || !follow) {
        throw new Error('未找到用户');
      }

      if (behavior.delete) {
        follow.follower_count -= 1;
        follow.save();
        author.following_count -= 1;
        author.save();
        req.session.userInfo.following_count -= 1;
      } else {
        follow.follower_count += 1;
        follow.save();
        author.following_count += 1;
        author.save();
        req.session.userInfo.following_count += 1;
        // 发送提醒 notice
        await this.sendFollowNotice(_id, uid);
      }

      return res.send({
        status: 1,
        type: behavior.delete ? 'un_follow' : 'follow'
      });
    } catch(err) {
      return res.send({
        status: 0,
        type: 'ERROR_LIKE_OR_UN_LIKE_TOPIC',
        message: '关注或者取消关注用户失败'
      });
    }
  }
}

module.exports = new User();