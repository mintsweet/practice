const Base = require('./base');
const {
  signup, signin, forgetPass,
  getUserAction, getUserCreate, getUserLike,
  getUserCollect, getUserFollower, getUserFollowing,
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
    this.renderUserCreate = this.renderUserCreate.bind(this);
    this.renderUserLike = this.renderUserLike.bind(this);
    this.renderUserCollect = this.renderUserCollect.bind(this);
    this.renderUserFollower = this.renderUserFollower.bind(this);
    this.renderUserFollowing = this.renderUserFollowing.bind(this);
    this.renderSetting = this.renderSetting.bind(this);
    this.setting = this.setting.bind(this);
    this.renderUpdatePass = this.renderUpdatePass.bind(this);
    this.updatePass = this.updatePass.bind(this);
  }

  // 注册页
  async renderSignup(req, res) {
    const url = await this.getCaptchaUrl(req);
    return res.render('user/signup', {
      title: '注册',
      picUrl: url
    });
  }

  // 注册
  async signup(req, res) {
    const sms_code = req.app.locals.sms_code || {};
    const url = await this.getCaptchaUrl(req);

    if (!sms_code.mobile) {
      return res.render('user/signup', {
        title: '注册',
        error: '尚未获取短信验证码',
        picUrl: url
      });
    }

    try {
      await signup(req.body);
      return res.render('transform/index', {
        title: '注册成功',
        type: 'success',
        message: '注册成功'
      });
    } catch(err) {
      return res.render('user/signup', {
        title: '注册',
        error: err.error,
        picUrl: url
      });
    }
  }

  // 登录页
  async renderSignin(req, res) {
    const url = await this.getCaptchaUrl(req);
    return res.render('user/signin', {
      title: '登录',
      picUrl: url
    });
  }

  // 登录
  async signin(req, res) {
    const { mobile, password, piccaptcha } = req.body;
    const captcha = req.app.locals.captcha || {};
    const url = await this.getCaptchaUrl(req);

    if (piccaptcha.toUpperCase() !== captcha.token) {
      return res.render('user/signin', {
        title: '登录',
        error: '图形验证码错误',
        picUrl: url
      });
    } else if (Date.now() > captcha.expired) {
      return res.render('user/signin', {
        title: '登录',
        error: '图形验证码已经失效了，请重新获取',
        picUrl: url
      });
    }

    try {
      const jwt = await signin({ mobile, password });

      req.app.locals.jwt = jwt;

      return res.render('transform/index', {
        title: '登录成功',
        type: 'success',
        message: '登录成功'
      });
    } catch(err) {
      return res.render('user/signin', {
        title: '登录',
        error: err.error,
        picUrl: url
      });
    }
  }

  // 忘记密码页
  async renderForgetPass(req, res) {
    const url = await this.getCaptchaUrl(req);

    return res.render('user/forget_pass', {
      title: '忘记密码',
      picUrl: url
    });
  }

  // 忘记密码
  async forgetPass(req, res) {
    const sms_code = req.app.locals.sms_code || {};
    const url = await this.getCaptchaUrl(req);

    if (!sms_code.mobile) {
      return res.render('user/forget_pass', {
        title: '忘记密码',
        error: '尚未获取短信验证码',
        picUrl: url
      });
    }

    try {
      await forgetPass(req.body);

      return res.render('transform/index', {
        title: '找回密码成功',
        type: 'success',
        message: '找回密码成功'
      });
    } catch(err) {
      return res.render('user/forget_pass', {
        title: '忘记密码',
        error: err.error,
        picUrl: url
      });
    }
  }

  // 登出
  async signout(req, res) {
    req.app.locals.jwt = '';
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
    const data = await getUserAction(uid);

    return res.render('user/info', {
      title: '动态 - 用户信息',
      info,
      data,
      type: 'action'
    });
  }

  // 用户专栏页
  async renderUserCreate(req, res) {
    const { uid } = req.params;

    const info = await this.getUserInfo(uid);
    const data = await getUserCreate(uid);

    return res.render('user/info', {
      title: '专栏 - 用户信息',
      info,
      data,
      type: 'create'
    });
  }

  // 用户喜欢页
  async renderUserLike(req, res) {
    const { uid } = req.params;

    const info = await this.getUserInfo(uid);
    const data = await getUserLike(uid);

    return res.render('user/info', {
      title: '喜欢 - 用户信息',
      info,
      data,
      type: 'like'
    });
  }

  // 用户收藏页
  async renderUserCollect(req, res) {
    const { uid } = req.params;

    const info = await this.getUserInfo(uid);
    const data = await getUserCollect(uid);

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

    return res.render('user/setting', {
      title: '个人资料',
      top100: top100.slice(0, 10)
    });
  }

  // 更新个人设置
  async setting(req, res) {
    const top100 = await this.getUsersTop100();
    const { jwt } = req.app.locals;

    try {
      await setting(req.body, jwt);

      return res.render('transform/index', {
        type: 'success',
        message: '更新个人资料成功',
        url: '/setting'
      });
    } catch(err) {
      return res.render('user/setting', {
        title: '个人资料',
        error: err.error,
        top100
      });
    }
  }

  // 修改密码页
  async renderUpdatePass(req, res) {
    const top100 = await this.getUsersTop100();

    return res.render('user/update_pass', {
      title: '修改密码',
      top100: top100.slice(0, 10)
    });
  }

  // 修改密码
  async updatePass(req, res) {
    const top100 = await this.getUsersTop100();
    const { jwt } = req.app.locals;

    try {
      await updatePass(req.body, jwt);

      return res.render('transform/index', {
        type: 'success',
        message: '修改成功',
        url: '/update_pass'
      });
    } catch(err) {
      return res.render('user/update_pass', {
        title: '修改密码',
        error: err.error,
        top100
      });
    }
  }

  // 关注或者取消关注
  async followOrUn(req, res) {
    const { uid } = req.params;
    const { jwt } = req.app.locals;

    if (!jwt) {
      return res.send({
        status: 0,
        message: '尚未登录'
      });
    }

    try {
      const action = await followOrUn(uid, jwt);

      return res.send({
        status: 1,
        action
      });
    } catch(err) {
      return res.send({
        status: 0,
        message: err.error
      });
    }
  }
}

module.exports = new User();
