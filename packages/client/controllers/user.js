const API = require('../utils/api');

class User {
  constructor() {
    this.renderSignup = this.renderSignup.bind(this);
    this.signup = this.signup.bind(this);
    this.renderSignin = this.renderSignin.bind(this);
    this.signin = this.signin.bind(this);
    this.renderForgetPass = this.renderForgetPass.bind(this);
    this.forgetPass = this.forgetPass.bind(this);
  }

  // GitHub 登录
  async github(req, res) {
    const accessToken = req.user;

    global.token = await API.github({
      accessToken
    });

    return res.redirect('/');
  }

  async getCaptchaUrl(req) {
    const data = await API.getCaptcha({
      height: 34
    });

    req.app.locals.captcha = {
      token: data.token,
      expired: Date.now() + 1000 * 60 * 10
    };

    return data.url;
  }

  async renderSignup(req, res) {
    const url = await this.getCaptchaUrl(req);

    res.render('pages/user/signup', {
      title: '注册',
      url
    });
  }

  // 注册
  async signup(req, res) {
    const { nickname, email, password, captcha } = req.body;
    const data = req.app.locals.captcha || {};
    const url = await this.getCaptchaUrl(req);

    if (captcha.toUpperCase() !== data.token) {
      return res.render('pages/user/signin', {
        title: '登录',
        error: '图形验证码错误',
        url
      });
    } else if (Date.now() > data.expired) {
      return res.render('pages/user/signin', {
        title: '登录',
        error: '图形验证码已经失效了，请重新获取',
        url
      });
    }

    try {
      await API.signup({ nickname, email, password });
      return res.render('pages/transform', {
        title: '注册成功',
        type: 'success',
        message: '注册成功'
      });
    } catch(err) {
      return res.render('pages/user/signup', {
        title: '注册',
        error: err.error,
        picUrl: url
      });
    }
  }

  async renderSignin(req, res) {
    const url = await this.getCaptchaUrl(req);

    res.render('pages/user/signin', {
      title: '登录',
      url
    });
  }

  // 登录
  async signin(req, res) {
    const { email, password, captcha } = req.body;
    const data = req.app.locals.captcha || {};
    const url = await this.getCaptchaUrl(req);

    if (captcha.toUpperCase() !== data.token) {
      return res.render('pages/user/signin', {
        title: '登录',
        error: '图形验证码错误',
        url
      });
    } else if (Date.now() > data.expired) {
      return res.render('pages/user/signin', {
        title: '登录',
        error: '图形验证码已经失效了，请重新获取',
        url
      });
    }

    try {
      const jwt = await API.signin({ email, password });

      global.token = jwt;

      return res.render('pages/transform', {
        title: '登录成功',
        type: 'success',
        message: '登录成功'
      });
    } catch(err) {
      return res.render('pages/user/signin', {
        title: '登录',
        error: err.error,
        url
      });
    }
  }

  // 忘记密码页
  async renderForgetPass(req, res) {
    const url = await this.getCaptchaUrl(req);

    return res.render('pages/user/forget_pass', {
      title: '忘记密码',
      url
    });
  }

  // 忘记密码
  async forgetPass(req, res) {
    const { email, captcha } = req.body;
    const data = req.app.locals.captcha || {};
    const url = await this.getCaptchaUrl(req);

    if (captcha.toUpperCase() !== data.token) {
      return res.render('pages/user/signin', {
        title: '登录',
        error: '图形验证码错误',
        url
      });
    } else if (Date.now() > data.expired) {
      return res.render('pages/user/signin', {
        title: '登录',
        error: '图形验证码已经失效了，请重新获取',
        url
      });
    }

    try {
      await API.forgetPass({ email });

      return res.render('pages/transform', {
        title: '找回密码成功',
        type: 'success',
        message: '找回密码成功'
      });
    } catch(err) {
      return res.render('pages/user/forget_pass', {
        title: '忘记密码',
        error: err.error,
        picUrl: url
      });
    }
  }

  // 登出
  async signout(req, res) {
    global.token = '';
    req.app.locals.user = null;
    return res.render('pages/transform', {
      title: '退出成功',
      type: 'success',
      message: '退出成功'
    });
  }

  // 积分榜前一百
  async renderUsersTop100(req, res) {
    const top100 = await API.getUsersTop({ count: 100 });

    return res.render('pages/user/top100', {
      title: '积分榜前一百',
      top100
    });
  }


  // 个人信息页
  async renderUserInfo(req, res) {
    const { uid } = req.params;

    const info = await API.getUserById(uid);
    const data = await API.getUserAction(uid);

    return res.render('pages/user/info', {
      title: '动态 - 用户信息',
      type: 'action',
      info,
      data,
    });
  }

  // 用户专栏页
  async renderUserCreate(req, res) {
    const { uid } = req.params;

    const info = await API.getUserById(uid);
    const data = await API.getUserCreate(uid);

    return res.render('pages/user/info', {
      title: '专栏 - 用户信息',
      type: 'create',
      info,
      data,
    });
  }

  // 用户喜欢页
  async renderUserLike(req, res) {
    const { uid } = req.params;

    const info = await API.getUserById(uid);
    const data = await API.getUserLike(uid);

    return res.render('pages/user/info', {
      title: '喜欢 - 用户信息',
      type: 'like',
      info,
      data,
    });
  }

  // 用户收藏页
  async renderUserCollect(req, res) {
    const { uid } = req.params;

    const info = await API.getUserById(uid);
    const data = await API.getUserCollect(uid);

    return res.render('pages/user/info', {
      title: '收藏 - 用户信息',
      type: 'collect',
      info,
      data,
    });
  }

  // 用户粉丝页
  async renderUserFollower(req, res) {
    const { uid } = req.params;

    const info = await API.getUserById(uid);
    const data = await API.getUserFollower(uid);

    return res.render('pages/user/info', {
      title: '粉丝 - 用户信息',
      type: 'follower',
      info,
      data,
    });
  }

  // 用户关注页
  async renderUserFollowing(req, res) {
    const { uid } = req.params;

    const info = await API.getUserById(uid);
    const data = await API.getUserFollowing(uid);

    return res.render('pages/user/info', {
      title: '关注 - 用户信息',
      type: 'following',
      info,
      data,
    });
  }

  // 更新个人设置页
  async renderSetting(req, res) {
    const { id } = req.app.locals.user;

    const top100 = await API.getUsersTop();
    const user = await API.getUserById(id);

    return res.render('pages/user/setting', {
      title: '个人资料',
      top100,
      user
    });
  }

  // 更新个人设置
  async setting(req, res) {
    const { id } = req.app.locals.user;

    const top100 = await API.getUsersTop();
    const user = await API.getUserById(id);

    try {
      await API.updateSetting(req.body);

      return res.render('pages/transform', {
        title: '更新个人设置成功',
        type: 'success',
        message: '更新个人资料成功',
        url: '/setting'
      });
    } catch(err) {
      return res.render('pages/user/setting', {
        title: '个人资料',
        error: err.error,
        top100,
        user
      });
    }
  }

  // 修改密码页
  async renderUpdatePass(req, res) {
    const data = await API.getUsersTop();

    return res.render('pages/user/update_pass', {
      title: '修改密码',
      top100: data
    });
  }

  // 修改密码
  async updatePass(req, res) {
    const data = await API.getUsersTop();

    try {
      await API.updatePass(req.body);

      return res.render('pages/transform', {
        title: '修改密码成功',
        type: 'success',
        message: '修改成功',
        url: '/update_pass'
      });
    } catch(err) {
      return res.render('pages/user/update_pass', {
        title: '修改密码',
        error: err.error,
        top100: data
      });
    }
  }

  // 关注或者取消关注
  async followOrUn(req, res) {
    const { uid } = req.params;

    try {
      const action = await API.followOrUn(uid);

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
