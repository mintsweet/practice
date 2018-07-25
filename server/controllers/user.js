const formidable = require('formidable');
const bcrypt = require('bcryptjs');
const Base = require('./base');
const UserModel = require('../models/user');
const BehaviorModel = require('../models/behavior');
const TopicModel = require('../models/topic');

const SALT_WORK_FACTOR = 10;

class User extends Base {
  constructor() {
    super();
    this.signup = this.signup.bind(this);
    this.forgetPass = this.forgetPass.bind(this);
    this.updatePass = this.updatePass.bind(this);
    this.getUserStars = this.getUserStars.bind(this);
    this.followOrUnFollow = this.followOrUnFollow.bind(this);
    this.uploadAvatar = this.uploadAvatar.bind(this);
  }

  // 注册
  signup(req, res) {
    const form = new formidable.IncomingForm();
    form.parse(req, async (err, fields) => {
      if (err) {
        throw new Error(err);
      }

      const sms_code = req.session.sms_code || {};
      const { mobile, password, nickname, smscaptcha } = fields;

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
      const user = {
        nickname,
        mobile,
        password: bcryptPassword
      };

      await UserModel.create(user);

      return res.send({
        status: 1
      });
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
    form.parse(req, async (err, fields) => {
      if (err) {
        throw new Error(err);
      }

      const { mobile, password, issms, smscaptcha } = fields;

      if (!mobile || !/^1[3,5,7,8,9]\w{9}$/.test(mobile)) {
        return res.send({
          status: 0,
          type: 'ERROR_MOBILE_IS_INVALID',
          message: '请输入正确的手机号'
        });
      }

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

        req.session.user = existUser;
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

        req.session.user = existUser;
        return res.send({
          status: 1,
          data: existUser
        });
      }
    });
  }

  // 登出
  signout(req, res) {
    req.session.user = null;
    res.send({
      status: 1
    });
  }

  // 忘记密码
  forgetPass(req, res) {
    const form = new formidable.IncomingForm();
    form.parse(req, async (err, fields) => {
      if (err) {
        throw new Error(err);
      }

      const sms_code = req.session.sms_code || {};
      const { mobile, newPassword, smscaptcha } = fields;

      try {
        if (!mobile || !/^1[3,5,7,8,9]\w{9}$/.test(mobile)) {
          throw new Error('请输入正确的手机号');
        } else if (!newPassword || !/(?!^(\d+|[a-zA-Z]+|[~!@#$%^&*?]+)$)^[\w~!@#$%^&*?].{6,18}/.test(newPassword)) {
          throw new Error('新密码必须为数字、字母和特殊字符其中两种组成并且在6-18位之间');
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
    });
  }

  // 获取当前用户信息
  getUserInfo(req, res) {
    return res.send({
      status: 1,
      data: req.session.user
    });
  }

  // 更新个人信息
  updateUserInfo(req, res) {
    const form = new formidable.IncomingForm();
    form.parse(req, async (err, fields) => {
      if (err) {
        throw new Error(err);
      }

      const { id, nickname: currentNickname } = req.session.user;
      const { nickname } = fields;

      const existUser = await UserModel.findOne({ nickname });

      if (existUser && nickname !== currentNickname) {
        return res.send({
          status: 0,
          type: 'NICKNAME_HAS_BEEN_REGISTERED',
          message: '昵称已经注册过了'
        });
      }

      const doc = await UserModel.findByIdAndUpdate(id, { ...fields }, { new: true });
      req.session.user = doc;

      return res.send({
        status: 1
      });
    });
  }

  // 修改密码
  updatePass(req, res) {
    const form = new formidable.IncomingForm();
    form.parse(req, async (err, fields) => {
      if (err) {
        throw new Error(err);
      }

      const { id } = req.session.user;
      const { oldPass, newPass } = fields;

      try {
        if (!oldPass) {
          throw new Error('旧密码不能为空');
        } else if (!newPass || !/(?!^(\d+|[a-zA-Z]+|[~!@#$%^&*?]+)$)^[\w~!@#$%^&*?].{6,18}/.test(newPass)) {
          throw new Error('新密码必须为数字、字母和特殊字符其中两种组成并且在6-18位之间');
        }
      } catch(err) {
        return res.send({
          status: 0,
          type: 'ERROR_PARMAS_OF_UPDATE_PASS',
          message: err.message
        });
      }

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
          message: '旧密码错误'
        });
      }
    });
  }

  // 获取星标用户列表
  async getStarList(req, res) {
    const userList = await UserModel.find({ star: true }, 'id avatar nickname location signature star');

    return res.send({
      status: 1,
      data: userList
    });
  }

  // 获取积分榜前一百用户
  async getTop100(req, res) {
    const userList = await UserModel.find({}, 'id nickname score avatar topic_count star_count collect_count follower_count', {
      limit: 100,
      sort: '-score'
    });

    return res.send({
      status: 1,
      data: userList
    });
  }

  // 根据ID获取用户信息
  async getInfoById(req, res) {
    const { uid } = req.params;

    const currentUser = await UserModel.findById(uid);

    if (!currentUser) {
      return res.send({
        status: 0,
        type: 'ERROR_ID_IS_INVALID',
        message: '无效的ID'
      });
    }

    const user = req.session.user || {};
    let follow = false;

    if (user.id) {
      const behavior = await BehaviorModel.findOne({ action: 'follow', author_id: user.id, target_id: uid });

      if (behavior && behavior.is_un === false) {
        follow = true;
      } else {
        follow = false;
      }
    }

    return res.send({
      status: 1,
      data: { ...currentUser.toObject({ virtuals: true }), follow }
    });
  }

  // 获取用户动态
  async getUserBehaviors(req, res) {
    const { uid } = req.params;
    const behaviors = await BehaviorModel.find({ author_id: uid, is_un: false });

    const result = await Promise.all(behaviors.map(item => {
      return new Promise(resolve => {
        if (item.action === 'follow') {
          resolve(UserModel.findById(item.target_id, 'id nickname signature avatar'));
        } else {
          resolve(TopicModel.findById(item.target_id, 'id title'));
        }
      });
    }));

    const data = behaviors.map((item, i) => {
      return { ...result[i].toObject(), action: item.action };
    });

    return res.send({
      status: 1,
      data
    });
  }

  // 获取用户专栏的列表
  async getUserCreates(req, res) {
    const { uid } = req.params;

    const createBehavior = await BehaviorModel.find({ action: 'create', author_id: uid, is_un: false });
    const result = await Promise.all(createBehavior.map(item => {
      return new Promise(resolve => {
        resolve(TopicModel.findById(item.target_id, 'id title star_count collect_count visit_count'));
      });
    }));

    const data = createBehavior.map((item, i) => {
      return { ...result[i].toObject(), action: 'create' };
    });

    return res.send({
      status: 1,
      data
    });
  }

  // 获取用户喜欢列表
  async getUserStars(req, res) {
    const { uid } = req.params;
    const starBehaviors = await BehaviorModel.find({ action: 'star', author_id: uid, is_un: false });
    const result = await Promise.all(starBehaviors.map(item => {
      return new Promise(resolve => {
        resolve(TopicModel.findById(item.target_id, 'id title'));
      });
    }));

    const data = starBehaviors.map((item, i) => {
      return { ...result[i].toObject(), action: 'star' };
    });

    return res.send({
      status: 1,
      data
    });
  }

  // 获取用户收藏列表
  async getUserCollections(req, res) {
    const { uid } = req.params;
    const collectBehavior = await BehaviorModel.find({ action: 'collect', author_id: uid, is_un: false });
    const result = await Promise.all(collectBehavior.map(item => {
      return new Promise(resolve => {
        resolve(TopicModel.findById(item.target_id, 'id title'));
      });
    }));

    const data = collectBehavior.map((item, i) => {
      return { ...result[i].toObject(), action: 'collect' };
    });

    return res.send({
      status: 1,
      data
    });
  }

  // 获取用户粉丝列表
  async getUserFollower(req, res) {
    const { uid } = req.params;
    const followerBehavior = await BehaviorModel.find({ action: 'follow', target_id: uid, is_un: false });
    const result = await Promise.all(followerBehavior.map(item => {
      return new Promise(resolve => {
        resolve(UserModel.findById(item.author_id, 'id nickname avatar'));
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
    const followingBehavior = await BehaviorModel.find({ action: 'follow', author_id: uid, is_un: false });
    const result = await Promise.all(followingBehavior.map(item => {
      return new Promise(resolve => {
        resolve(UserModel.findById(item.target_id, 'id nickname avatar'));
      });
    }));

    return res.send({
      status: 1,
      data: result
    });
  }

  // 关注或者取消关注某个用户
  async followOrUnFollow(req, res) {
    const { uid } = req.params;
    const { id } = req.session.user;

    const currentTarget = await UserModel.findById(uid);
    const currentAuthor = await UserModel.findById(id);

    if (!currentTarget) {
      return res.send({
        status: 0,
        type: 'ERROR_ID_IS_INVALID',
        message: '无效的ID'
      });
    }

    const behavior = await this.generateBehavior('follow', id, uid);

    if (behavior.is_un) {
      currentTarget.follower_count -= 1;
      await currentTarget.save();
      currentAuthor.following_count -= 1;
      await currentAuthor.save();
      req.session.user.following_count -= 1;
    } else {
      currentTarget.follower_count += 1;
      await currentTarget.save();
      currentAuthor.following_count += 1;
      await currentAuthor.save();
      req.session.user.following_count += 1;
      await this.sendFollowNotice(id, uid);
    }

    return res.send({
      status: 1,
      data: behavior.actualAction
    });
  }

  uploadAvatar(req, res) {
    const form = new formidable.IncomingForm();
    form.parse(req, async (err, fields, files) => {
      if (err) {
        throw new Error(err);
      }

      const { file: { path } } = files;
      const { id } = req.session.user;
      const fileName = `avatar_${id}`;

      const url = this.uploadImg(fileName, path);

      return res.send({
        status: 1,
        data: url
      });
    });
  }
}

module.exports = new User();
