const API = require('../utils/api');

class User {
  constructor() {
    this.renderSignup = this.renderSignup.bind(this);
    this.renderSignin = this.renderSignin.bind(this);
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

  async renderSignin(req, res) {
    const url = await this.getCaptchaUrl(req);

    res.render('pages/user/signin', {
      title: '登录',
      url
    });
  }
}

module.exports = new User();
