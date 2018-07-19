const formidable = require('formidable');
const Base = require('./base');
const {
  signup, signin, forgetPass, signout,
  getUserBehaviors, getUserCreates, getUserStars,
  getUserCollections, getUserFollower, getUserFollowing,
  setting, updatePass, followOrUn
} = require('../http/api');

class User extends Base {
  constructor() {
    super();
    this.renderSignup = this.renderSignup.bind(this);
    this.signup = this.signup.bind(this);
    this.renderSignin = this.renderSignin.bind(this);
    this.signin = this.signin.bind(this);
    this.renderForgetPass = this.renderForgetPass.bind(this);
    this.forgetPass = this.forgetPass.bind(this);
    this.renderUsersTop100 = this.renderUsersTop100.bind(this);
    this.renderUserInfo = this.renderUserInfo.bind(this);
    this.renderUserCreates = this.renderUserCreates.bind(this);
    this.renderUserStars = this.renderUserStars.bind(this);
    this.renderUserCollections = this.renderUserCollections.bind(this);
    this.renderUserFollower = this.renderUserFollower.bind(this);
    this.renderUserFollowing = this.renderUserFollowing.bind(this);
    this.renderSetting = this.renderSetting.bind(this);
    this.setting = this.setting.bind(this);
    this.renderUpdatePass = this.renderUpdatePass.bind(this);
    this.updatePass = this.updatePass.bind(this);
  }

  // 注册页
  async renderSignup(req, res) {
    const url = await this.getPicCaptchaUrl(req);

    return res.render('user/signup', {
      title: '注册',
      picUrl: url
    });
  }

  // 注册
  signup(req, res) {
    const form = new formidable.IncomingForm();
    form.parse(req, async (err, fields) => {
      if (err) {
        throw new Error(err);
      }

      const sms_code = req.app.locals.sms_code || {};
      const url = await this.getPicCaptchaUrl(req);

      if (!sms_code.mobile) {
        return res.render('user/signup', {
          title: '注册',
          error: '尚未获取短信验证码',
          picUrl: url
        });
      }

      try {
        await signup(fields);

        return res.render('transform/index', {
          title: '注册成功',
          type: 'success',
          message: '注册成功'
        });
      } catch(err) {
        return res.render('user/signup', {
          title: '注册',
          error: err.message,
          picUrl: url
        });
      }
    });
  }

  // 登录页
  async renderSignin(req, res) {
    const url = await this.getPicCaptchaUrl(req);

    res.render('user/signin', {
      title: '登录',
      picUrl: url
    });
  }

  // 登录
  signin(req, res) {
    const form = new formidable.IncomingForm();
    form.parse(req, async (err, fields) => {
      if (err) {
        throw new Error(err);
      }

      const { mobile, password, piccaptcha } = fields;
      const pic_token = req.app.locals.pic_token || {};

      const url = await this.getPicCaptchaUrl(req);

      if (piccaptcha.toUpperCase() !== pic_token.token) {
        return res.render('user/signin', {
          title: '登录',
          error: '图形验证码错误',
          picUrl: url
        });
      } else if (Date.now() > pic_token.expired) {
        return res.render('user/signin', {
          title: '登录',
          error: '图形验证码已经失效了，请重新获取',
          picUrl: url
        });
      }

      try {
        await signin({ mobile, password });

        return res.render('transform/index', {
          title: '登录成功',
          type: 'success',
          message: '登录成功'
        });
      } catch(err) {
        return res.render('user/signin', {
          title: '登录',
          error: err.message,
          picUrl: url
        });
      }
    });
  }

  // 忘记密码页
  async renderForgetPass(req, res) {
    const url = await this.getPicCaptchaUrl(req);

    res.render('user/forget_pass', {
      title: '忘记密码',
      picUrl: url
    });
  }

  // 忘记密码
  async forgetPass(req, res) {
    const form = new formidable.IncomingForm();
    form.parse(req, async (err, fields) => {
      if (err) {
        throw new Error(err);
      }

      const sms_code = req.app.locals.sms_code || {};
      const url = await this.getPicCaptchaUrl(req);

      if (!sms_code.mobile) {
        return res.render('user/forget_pass', {
          title: '忘记密码',
          error: '尚未获取短信验证码',
          picUrl: url
        });
      }

      try {
        await forgetPass(fields);

        return res.render('transform/index', {
          title: '找回密码成功',
          type: 'success',
          message: '找回密码成功'
        });
      } catch(err) {
        return res.render('user/forget_pass', {
          title: '忘记密码',
          error: err.message,
          picUrl: url
        });
      }
    });
  }

  // 登出
  async signout(req, res) {
    await signout();

    return res.render('transform/index', {
      title: '退出成功',
      type: 'success',
      message: '退出成功'
    });
  }

  // 积分榜前一百
  async renderUsersTop100(req, res) {
    const top100 = await this.getUsersTop100();

    return res.render('user/top100', {
      title: '积分榜前一百',
      top100
    });
  }

  // 个人信息页
  async renderUserInfo(req, res) {
    const { uid } = req.params;

    const info = await this.getUserInfo(uid);
    const data = await getUserBehaviors(uid);

    res.render('user/info', {
      title: '动态 - 用户信息',
      info,
      data,
      type: 'behavior'
    });
  }

  // 用户专栏页
  async renderUserCreates(req, res) {
    const { uid } = req.params;

    const info = await this.getUserInfo(uid);
    const data = await getUserCreates(uid);

    return res.render('user/info', {
      title: '专栏 - 用户信息',
      info,
      data,
      type: 'create'
    });
  }

  // 用户喜欢页
  async renderUserStars(req, res) {
    const { uid } = req.params;

    const info = await this.getUserInfo(uid);
    const data = await getUserStars(uid);

    return res.render('user/info', {
      title: '喜欢 - 用户信息',
      info,
      data,
      type: 'star'
    });
  }

  // 用户收藏页
  async renderUserCollections(req, res) {
    const { uid } = req.params;

    const info = await this.getUserInfo(uid);
    const data = await getUserCollections(uid);

    return res.render('user/info', {
      title: '收藏 - 用户信息',
      info,
      data,
      type: 'collect'
    });
  }

  // 用户粉丝页
  async renderUserFollower(req, res) {
    const { uid } = req.params;

    const info = await this.getUserInfo(uid);
    const data = await getUserFollower(uid);

    return res.render('user/info', {
      title: '粉丝 - 用户信息',
      info,
      data,
      type: 'follower'
    });
  }

  // 用户关注页
  async renderUserFollowing(req, res) {
    const { uid } = req.params;

    const info = await this.getUserInfo(uid);
    const data = await getUserFollowing(uid);

    return res.render('user/info', {
      title: '关注 - 用户信息',
      info,
      data,
      type: 'following'
    });
  }

  // 更新个人设置页
  async renderSetting(req, res) {
    const top100 = await this.getUsersTop100();

    res.render('user/setting', {
      title: '个人资料',
      top100: top100.slice(0, 10)
    });
  }

  // 更新个人设置
  setting(req, res) {
    const form = new formidable.IncomingForm();
    form.parse(req, async (err, fields) => {
      if (err) {
        throw new Error(err);
      }

      const top100 = await this.getUsersTop100();

      try {
        await setting({ ...fields });

        res.render('user/transform', {
          type: 'success',
          message: '更新个人资料成功',
          url: '/setting'
        });
      } catch(err) {
        res.render('user/setting', {
          title: '个人资料',
          error: err.message,
          top100
        });
      }
    });
  }

  // 修改密码页
  async renderUpdatePass(req, res) {
    const top100 = await this.getUsersTop100();

    res.render('user/update_pass', {
      title: '修改密码',
      top100: top100.slice(0, 10)
    });
  }

  // 修改密码
  updatePass(req, res) {
    const form = new formidable.IncomingForm();
    form.parse(req, async (err, fields) => {
      if (err) {
        throw new Error(err);
      }

      const top100 = await this.getUsersTop100();

      try {
        await updatePass({ ...fields });

        res.render('transform/index', {
          type: 'success',
          message: '修改成功',
          url: '/update_pass'
        });
      } catch(err) {
        res.render('user/update_pass', {
          title: '修改密码',
          error: err.message,
          top100
        });
      }
    });
  }

  // 关注或者取消关注
  async followOrUn(req, res) {
    const { uid } = req.params;
    const { user } = req.app.locals;

    if (!user) {
      return res.send({
        status: 0,
        message: '尚未登录'
      });
    }

    try {
      const action = await followOrUn(uid);

      return res.send({
        status: 1,
        action
      });
    } catch(err) {
      return res.send({
        status: 0,
        message: err.message
      });
    }
  }
}

module.exports = new User();
