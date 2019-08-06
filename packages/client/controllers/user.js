const API = require('../utils/api');

const getCaptchaUrl = async req => {
  const data = await API.getCaptcha({
    height: 34,
  });

  req.session.captcha = {
    token: data.token,
    expired: Date.now() + 1000 * 60 * 3,
  };

  return data.url;
};

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

    req.session.token = await API.github({
      accessToken
    });

    res.redirect('/');
  }

  // 注册页
  async renderSignup(req, res) {
    const url = await getCaptchaUrl(req);
    res.render(
      'pages/user/signup',
      {
        title: '注册',
        url,
      }
    );
  }

  // 注册
  async signup(req, res) {
    const { nickname, email, password, captcha } = req.body;
    const { captcha: data } = req.session;

    try {
      if (captcha.toUpperCase() !== data.token) {
        throw new Error('图形验证码错误');
      } else if (Date.now() > data.expired) {
        throw new Error('图形验证码已经失效了，请重新获取');
      }

      await API.signup({ nickname, email, password });

      res.render(
        'pages/user/email',
        {
          title: '注册',
          email,
        }
      );
    } catch(err) {
      const url = await getCaptchaUrl(req);
      res.render(
        'pages/user/signup',
        {
          title: '注册',
          error: err.message,
          url,
        }
      );
    }
  }

  // 登录页
  async renderSignin(req, res) {
    const url = await getCaptchaUrl(req);
    res.render(
      'pages/user/signin',
      {
        title: '登录',
        url,
      }
    );
  }

  // 登录
  async signin(req, res) {
    const { email, password, captcha } = req.body;
    const { captcha: data } = req.session;

    try {
      if (captcha.toUpperCase() !== data.token) {
        throw new Error('图形验证码错误');
      } else if (Date.now() > data.expired) {
        throw new Error('图形验证码已经失效了，请重新获取');
      }

      req.session.token = await API.signin({
        email,
        password,
      });

      res.redirect('/');
    } catch(err) {
      const url = await getCaptchaUrl(req);
      res.render(
        'pages/user/signin',
        {
          title: '登录',
          error: err.message,
          url,
        }
      );
    }
  }

  // 忘记密码页
  async renderForgetPass(req, res) {
    const url = await getCaptchaUrl(req);
    res.render(
      'pages/user/forget_pass',
      {
        title: '忘记密码',
        url,
      }
    );
  }

  // 忘记密码
  async forgetPass(req, res) {
    const { email, captcha } = req.body;
    const { captcha: data } = req.session;

    try {
      if (captcha.toUpperCase() !== data.token) {
        throw new Error('图形验证码错误');
      } else if (Date.now() > data.expired) {
        throw new Error('图形验证码已经失效了，请重新获取');
      }

      await API.forgetPass({ email });

      res.render(
        'pages/user/email',
        {
          title: '忘记密码',
          email,
        }
      );
    } catch(err) {
      const url = await getCaptchaUrl(req);
      res.render(
        'pages/user/forget_pass',
        {
          title: '忘记密码',
          error: err.message,
          url,
        }
      );
    }
  }

  // 登出
  async signout(req, res) {
    req.session.token = '';
    req.app.locals.user = null;
    res.redirect('/');
  }

  // 积分榜前一百页
  async renderUsersTop100(req, res) {
    const top100 = await API.getUsersTop({ count: 100 });

    res.render(
      'pages/user/top100',
      {
        title: '积分榜前一百',
        top100,
      }
    );
  }

  // 个人信息页
  async renderUserInfo(req, res) {
    const { uid } = req.params;

    const info = await API.getUserById(uid);
    const data = await API.getUserAction(uid);

    res.render(
      'pages/user/info',
      {
        title: '动态 - 用户信息',
        type: 'action',
        info,
        data,
      }
    );
  }

  // 用户专栏页
  async renderUserCreate(req, res) {
    const { uid } = req.params;

    const info = await API.getUserById(uid);
    const data = await API.getUserCreate(uid);

    res.render(
      'pages/user/info',
      {
        title: '专栏 - 用户信息',
        type: 'create',
        info,
        data,
      }
    );
  }

  // 用户喜欢页
  async renderUserLike(req, res) {
    const { uid } = req.params;

    const info = await API.getUserById(uid);
    const data = await API.getUserLike(uid);

    res.render(
      'pages/user/info',
      {
        title: '喜欢 - 用户信息',
        type: 'like',
        info,
        data,
      }
    );
  }

  // 用户收藏页
  async renderUserCollect(req, res) {
    const { uid } = req.params;

    const info = await API.getUserById(uid);
    const data = await API.getUserCollect(uid);

    res.render(
      'pages/user/info',
      {
        title: '收藏 - 用户信息',
        type: 'collect',
        info,
        data,
      }
    );
  }

  // 用户粉丝页
  async renderUserFollower(req, res) {
    const { uid } = req.params;

    const info = await API.getUserById(uid);
    const data = await API.getUserFollower(uid);

    res.render(
      'pages/user/info',
      {
        title: '粉丝 - 用户信息',
        type: 'follower',
        info,
        data,
      }
    );
  }

  // 用户关注页
  async renderUserFollowing(req, res) {
    const { uid } = req.params;

    const info = await API.getUserById(uid);
    const data = await API.getUserFollowing(uid);

    res.render(
      'pages/user/info',
      {
        title: '关注 - 用户信息',
        type: 'following',
        info,
        data,
      }
    );
  }

  // 更新个人设置页
  async renderSetting(req, res) {
    const { id } = req.app.locals.user;

    const top100 = await API.getUsersTop();
    const user = await API.getUserById(id);

    res.render(
      'pages/user/setting',
      {
        title: '个人资料',
        top100,
        user,
      }
    );
  }

  // 更新个人设置
  async setting(req, res) {
    const { id } = req.app.locals.user;
    const { token } = req.session;

    const top100 = await API.getUsersTop();
    const user = await API.getUserById(id);

    try {
      await API.updateSetting(req.body, token);
      res.redirect('/setting');
    } catch(err) {
      res.render(
        'pages/user/setting',
        {
          title: '个人资料',
          error: err.message,
          top100,
          user,
        }
      );
    }
  }

  // 修改密码页
  async renderUpdatePass(req, res) {
    const data = await API.getUsersTop();

    res.render(
      'pages/user/update_pass',
      {
        title: '修改密码',
        top100: data,
      }
    );
  }

  // 修改密码
  async updatePass(req, res) {
    const { token } = req.session;

    const data = await API.getUsersTop();

    try {
      await API.updatePass(req.body, token);
      res.redirect('update_pass');
    } catch(err) {
      res.render('pages/user/update_pass', {
        title: '修改密码',
        error: err.error,
        top100: data,
      });
    }
  }

  // 关注或者取消关注
  async followOrUn(req, res) {
    const { token } = req.session;
    const { uid } = req.params;

    try {
      const action = await API.followOrUn(uid, token);

      res.send({
        status: 1,
        action,
      });
    } catch(err) {
      res.send({
        status: 0,
        message: err.error
      });
    }
  }

  async sendMail(req, res) {
    const { email } = req.query;

    try {
      await API.sendMail(email);
      res.send({ status: 1 });
    } catch(err) {
      res.send({ status: 0, message: err.message });
    }
  }
}

module.exports = new User();
