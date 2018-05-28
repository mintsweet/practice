const formidable = require('formidable');
const bcrypt = require('bcryptjs');
const BaseComponent = require('../prototype/BaseComponent');
const UserModel = require('../models/user');
const TopicModel = require('../models/topic');
const ReplyModel = require('../models/reply');

const SALT_WORK_FACTOR = 10;

class User extends BaseComponent {
  constructor() {
    super();
    this.signup = this.signup.bind(this);
    this.forgetPass = this.forgetPass.bind(this);
    this.updatePass = this.updatePass.bind(this);
  }

  // 注册
  signup(req, res) {
    const form = new formidable.IncomingForm();
    form.parse(req, async (err, fields, files) => {
      if (err) {
        return res.send({
          status: 0,
          type: 'ERROR_PARMAS',
          message: '参数解析失败'
        });
      }

      const { nickname, mobile, password } = fields;
      let existUser;
      existUser = await UserModel.findOne({ mobile });
      if (existUser) {
        return res.send({
          status: 0,
          type: 'USER_HASN_EXIST',
          message: '手机号已经存在了'
        });
      }
      existUser = await UserModel.findOne({ nickname });
      if (existUser) {
        return res.send({
          status: 0,
          type: 'USER_HASH_EXIST',
          message: '昵称已经存在了'
        });
      }

      try {
        if (!mobile || !/^1[3,5,7,8,9]\d{9}$/.test(mobile)) {
          throw new Error('请输入正确的手机号');
        } else if (!password || !/(?!^(\d+|[a-zA-Z]+|[~!@#$%^&*?]+)$)^[\w~!@#$%^&*?].{6,18}/.test(password)) {
          throw new Error('密码必须为数字、字母和特殊字符其中两种组成并且在6-18位之间');
        } else if (!nickname || nickname.length > 8 || nickname.length < 4) {
          throw new Error('请输入4-8位的名称');
        }
      } catch(err) {
        return res.send({
          status: 0,
          type: 'ERROR_SIGNUP_PARMAS',
          message: err.message
        });
      }

      const bcryptPassword = await this.encryption(password);
      const userId = await this.getId('user_id');
      const userInfo = {
        id: userId,
        nickname,
        password: bcryptPassword,
        mobile
      };

      try {
        await UserModel.create(userInfo);
        return res.send({
          status: 1
        });
      } catch(err) {
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
        return res.send({
          status: 0,
          type: 'ERROR_PARMAS',
          message: '参数解析失败'
        });
      }

      const { type, mobile, password, msgcaptcha } = fields;

      try {
        if (!type && (type !== 'acc' || type !== 'mct')) {
          throw new Error('请输入正确的登录方式');
        } else if (!mobile || !/^1[3,5,7,8,9]\d{9}$/.test(mobile)) {
          throw new Error('请输入正确的手机号');
        }
      } catch(err) {
        return res.send({
          status: 0,
          type: 'ERROR_SIGNIN_PARMAS',
          message: err.message
        });
      }

      const existUser = await UserModel.findOne({ mobile }, '-_id -__v');
      if (!existUser) {
        return res.send({
          status: 0,
          type: 'ERROR_USER_IS_NOT_EXITS',
          message: '手机账户账户不存在'
        });
      }

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
          } else if ((Date.now() - msg_code.time) / (1000 * 60) > 10) {
            throw new Error('短信验证码已经失效了，请重新获取');
          }
        } catch(err) {
          return res.send({
            status: 0,
            type: 'ERROR_MSG_CAPTCHA_NOT_MATCH',
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
      delete res.session.userInfo;
      res.send({
        status: 1
      });
    } catch(err) {
      res.send({
        status: 0,
        type: 'ERROR_SIGNOUT_FAILED',
        message: err.message
      });
    }
  }

  // 忘记密码
  forgetPass(req, res) {
    const form = new formidable.IncomingForm();
    form.parse(req, async (err, fields, files) => {
      if (err) {
        return res.send({
          status: 0,
          type: 'ERROR_PARMAS',
          message: '参数解析失败'
        });
      }
      const { msg_code } = req.session;
      const { mobile, newPassword , msgcaptcha } = fields;

      try {
        if (mobile && mobile !== msg_code.mobile) {
          throw new Error('提交手机号与获取验证码手机号不对应');
        } else if (msg_code.code !== msgcaptcha) {
          throw new Error('验证码错误');
        } else if ((Date.now() - msg_code.time) / (1000 * 60) > 10) {
          throw new Error('验证码已失效，请重新获取');
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

      const bcryptPassword = await this.encryption(newPassword);
      await UserModel.findOneAndUpdate({ mobile }, {$set: {password: bcryptPassword}});
      return res.send({
        status: 1
      });
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

      const { mobile } = req.session.userInfo;
      const { oldPassword , newPassword } = fields;
      
      try {
        if (!mobile) {
          throw new Error('手机号不能为空');
        } else if (!oldPassword) {
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
  
      const existUser = await UserModel.findOne({ mobile }, '-_id -__v');
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
        await UserModel.findOneAndUpdate({ mobile }, {$set: {password: bcryptPassword}});
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

  // 通过昵称获取用户信息
  async getInfoNickname(req, res) {
    const { nickname } = req.params;

    if (!nickname) {
      return res.send({
        status: 0,
        type: 'ERROR_PARAMS',
        message: '无效的昵称'
      });
    }

    const user = await UserModel.findOne({ nickname }, '-_id -__v -password -mobile -is_admin -roles -create_at -update_at -id');

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

      const { userInfo } = req.session;
      const { nickname, avatar, location, signature } = fields;

    });
  }

  // 获取星标用户列表
  async getStartList(req, res) {
    try {
      const userList = await UserModel.find({ is_start: true }, '-_id -__v -password -mobile -is_admin -roles -create_at -update_at -id');
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
      const userList = await UserModel.find({}, {
        sort: { score: 1 }
      });
      return res.send({
        status: 1,
        data: userList.slice(0, 100)
      });
    } catch(err) {
      return res.send({
        status: 0,
        type: 'ERROR_GET_START_LIST',
        message: '获取星标用户失败'
      });
    }
  }

  // 获取用户收藏列表
  async getUserCollections(req, res) {
    const { nickname } = req.params;
    try {
      const user = await UserModel.findOne({ nickname });
      const collections = user.collect_list;
      const data = collections.map(async item => {
        return await TopicModel.findById({ item });
      });
  
      return res.send({
        status: 1,
        data
      });
    } catch(err) {
      return res.send({
        status: 0,
        type: 'ERROR_GET_USER_INFO',
        message: '获取用户失败'
      });
    }
  }

  // 用户回复的列表
  async getUserReplies(req, res) {
    const { nickname } = req.params;
    try {
      const user = await UserModel.findOne({ nickname });
      const replies = user.reply_list;
      const data = replies.map(async item => {
        return await ReplyModel.findById({ item });
      });
  
      return res.send({
        status: 1,
        data
      });
    } catch(err) {
      return res.send({
        status: 0,
        type: 'ERROR_GET_USER_INFO',
        message: '获取用户失败'
      });
    }
  }
  
  // 获取用户粉丝列表
  async getUserFollower(req, res) {
    const { nickname } = req.params;
    try {
      const user = await UserModel.findOne({ nickname });
      const follower = user.follower_list;
      const data = follower.map(async item => {
        return await UserModel.findById({ item });
      });
  
      return res.send({
        status: 1,
        data
      });
    } catch(err) {
      return res.send({
        status: 0,
        type: 'ERROR_GET_USER_INFO',
        message: '获取用户失败'
      });
    }
  }

  // 获取用户关注的人列表
  async getUserFollowing(req, res) {
    const { nickname } = req.params;
    try {
      const user = await UserModel.findOne({ nickname });
      const following = user.following_list;
      const data = following.map(async item => {
        return await UserModel.findById({ item });
      });
  
      return res.send({
        status: 1,
        data
      });
    } catch(err) {
      return res.send({
        status: 0,
        type: 'ERROR_GET_USER_INFO',
        message: '获取用户失败'
      });
    }
  }
}

module.exports = new User();