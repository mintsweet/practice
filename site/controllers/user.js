const formidable = require('formidable');
const {
  signup, signin, forgetPass, signout,
  getUserStars, getUserCollections, getUserReplies,
  getUserBehaviors, getUserFollower, getUserFollowing,
  setting, updatePass, followOrUn
} = require('../http/api');
const BaseComponent = require('../prototype/BaseComponent');

class User extends BaseComponent {
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
    this.renderUserStars = this.renderUserStars.bind(this);
    this.renderUserCollections = this.renderUserCollections.bind(this);
    this.renderUserReplies = this.renderUserReplies.bind(this);
    this.renderUserFollower = this.renderUserFollower.bind(this);
    this.renderUserFollowing = this.renderUserFollowing.bind(this);
    this.renderSetting = this.renderSetting.bind(this);
    this.setting = this.setting.bind(this);
    this.renderUpdatePass = this.renderUpdatePass.bind(this);
    this.updatePass = this.updatePass.bind(this);
  }

  // 注册页
  async renderSignup(req, res) {
    const url = await this.getPicCaptcha(req);
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
        return res.render('user/signup', {
          title: '注册',
          error: err
        });
      }

      const sms_code = req.app.locals.sms_code || {};
      const url = await this.getPicCaptcha(req);

      if (!sms_code.mobile) {
        return res.render('user/signup', {
          title: '注册',
          error: '尚未获取短信验证码',
          picUrl: url
        });
      }

      const response = await signup(fields);
      if (response.status === 1) {
        return res.render('site/transform', {
          title: '注册成功',
          type: 'success',
          message: '注册成功'
        });
      } else {
        return res.render('user/signup', {
          title: '注册',
          error: response.message,
          picUrl: url
        });
      }
    });
  }

  // 登录页
  async renderSignin(req, res) {
    const url = await this.getPicCaptcha(req);
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
        return res.render('user/signin', {
          title: '登录',
          error: err
        });
      }

      const { mobile, password, piccaptcha } = fields;
      const { pic_token } = req.app.locals;

      const url = await this.getPicCaptcha(req);

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

      const response = await signin({ mobile, password });
      if (response.status === 1) {
        return res.render('site/transform', {
          title: '登录成功',
          type: 'success',
          message: '登录成功'
        });
      } else {
        return res.render('user/signin', {
          title: '登录',
          error: response.message,
          picUrl: url
        });
      }
    });
  }

  // 忘记密码页
  async renderForgetPass(req, res) {
    const url = await this.getPicCaptcha(req);
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
        return res.render('user/forget_pass', {
          title: '忘记密码',
          error: err
        });
      }

      const sms_code = req.app.locals.sms_code || {};
      const url = await this.getPicCaptcha(req);

      if (!sms_code.mobile) {
        return res.render('user/forget_pass', {
          title: '忘记密码',
          error: '尚未获取短信验证码',
          picUrl: url
        });
      }

      const response = await forgetPass(fields);
      if (response.status === 1) {
        return res.render('site/transform', {
          title: '找回密码成功',
          type: 'success',
          message: '找回密码成功'
        });
      } else {
        return res.render('user/forget_pass', {
          title: '忘记密码',
          error: response.message,
          picUrl: url
        });
      }
    });
  }

  // 登出
  async signout(req, res) {
    const response = await signout();
    if (response.status === 1) {
      return res.render('site/transform', {
        title: '退出成功',
        type: 'success',
        message: '退出成功'
      });
    }
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

    try {
      const info = await this.getUserInfo(uid);
      const response = await getUserBehaviors(uid);

      if (response.status === 1) {
        res.render('user/info', {
          title: '动态 - 用户信息',
          info,
          data: response.data,
          type: 'behavior'
        });
      } else {
        res.render('exception/error', {
          title: '错误',
          error: response.data
        });
      }
    } catch(err) {
      res.render('exception/500', {
        title: 500
      });
    }
  }

  // 用户喜欢页
  async renderUserStars(req, res) {
    const { uid } = req.params;

    try {
      const info = await this.getUserInfo(uid);
      const response = await getUserStars(uid);

      if (response.status === 1) {
        return res.render('user/info', {
          title: '喜欢 - 用户信息',
          info,
          data: response.data,
          type: 'star'
        });
      } else {
        res.render('exception/error', {
          title: '错误',
          error: response.data
        });
      }
    } catch(err) {
      res.render('exception/500', {
        title: 500
      });
    }
  }

  // 用户收藏页
  async renderUserCollections(req, res) {
    const { uid } = req.params;

    try {
      const info = await this.getUserInfo(uid);
      const response = await getUserCollections(uid);

      if (response.status === 1) {
        return res.render('user/info', {
          title: '收藏 - 用户信息',
          info,
          data: response.data,
          type: 'collect'
        });
      } else {
        res.render('exception/error', {
          title: '错误',
          error: response.data
        });
      }
    } catch(err) {
      res.render('exception/500', {
        title: 500
      });
    }
  }

  // 用户回复页
  async renderUserReplies(req, res) {
    const { uid } = req.params;

    try {
      const info = await this.getUserInfo(uid);
      const response = await getUserReplies(uid);

      if (response.status === 1) {
        return res.render('user/info', {
          title: '回复 - 用户信息',
          info,
          data: response.data,
          type: 'reply'
        });
      } else {
        res.render('exception/error', {
          title: '错误',
          error: response.data
        });
      }
    } catch(err) {
      res.render('exception/500', {
        title: 500
      });
    }
  }

  // 用户粉丝页
  async renderUserFollower(req, res) {
    const { uid } = req.params;

    try {
      const info = await this.getUserInfo(uid);
      const response = await getUserFollower(uid);

      if (response.status === 1) {
        return res.render('user/info', {
          title: '粉丝 - 用户信息',
          info,
          data: response.data,
          type: 'follower'
        });
      } else {
        res.render('exception/error', {
          title: '错误',
          error: response.data
        });
      }
    } catch(err) {
      res.render('exception/500', {
        title: 500
      });
    }
  }

  // 用户关注页
  async renderUserFollowing(req, res) {
    const { uid } = req.params;

    try {
      const info = await this.getUserInfo(uid);
      const response = await getUserFollowing(uid);

      if (response.status === 1) {
        return res.render('user/info', {
          title: '关注 - 用户信息',
          info,
          data: response.data,
          type: 'following'
        });
      } else {
        res.render('exception/error', {
          title: '错误',
          error: response.data
        });
      }
    } catch(err) {
      res.render('exception/500', {
        title: 500
      });
    }
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
        return res.render('user/setting', {
          title: '个人资料',
          error: err
        });
      }

      const response = await setting({ ...fields });
      const top100 = await this.getUsersTop100();

      if (response.status === 1) {
        req.app.locals.user = response.data;
        res.render('user/setting', {
          type: 'success',
          message: '更新个人资料成功',
          url: '/setting'
        });
      } else {
        res.render('user/setting', {
          title: '个人资料',
          error: response.message,
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
        return res.render('user/update_pass', {
          title: '修改密码',
          error: err
        });
      }

      const response = await updatePass({ ...fields });
      const top100 = await this.getUsersTop100();

      if (response.status === 1) {
        res.render('site/transform', {
          type: 'success',
          message: '修改成功',
          url: '/update_pass'
        });
      } else {
        res.render('user/update_pass', {
          title: '修改密码',
          error: response.message,
          top100
        });
      }
    });
  }

  // 关注或者取消关注
  async followOrUnfollowUser(req, res) {
    const { uid } = req.params;

    const response = await followOrUn(uid);

    if (response.status === 1) {
      return res.send({
        status: 1,
        action: response.action
      });
    } else {
      return res.send({
        status: 0,
        message: response.message
      });
    }
  }
}

module.exports = new User();
