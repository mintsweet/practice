const API = require('../utils/api');

class User {
  constructor() {
    this.renderSignup = this.renderSignup.bind(this);
    this.signup = this.signup.bind(this);
    this.renderSignin = this.renderSignin.bind(this);
    this.signin = this.signin.bind(this);
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
}

module.exports = new User();
