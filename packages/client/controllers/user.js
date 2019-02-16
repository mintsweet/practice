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
    const { nickanme, email, password, captcha } = req.body;
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
      await API.signup({ nickanme, email, password });
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
}

module.exports = new User();
