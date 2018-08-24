const Base = require('./base');
const { getSmsCode } = require('../http/api');

class Captcha extends Base {
  constructor() {
    super();
    this.getCaptcha = this.getCaptcha.bind(this);
  }

  async getCaptcha(req, res) {
    try {
      const url = await this.getCaptchaUrl(req);
      return res.send({
        status: 1,
        data: url
      });
    } catch(err) {
      return res.send({
        status: 0,
        message: err.message
      });
    }
  }

  async getSmsCode(req, res) {
    const { piccaptcha, mobile } = req.query;
    const captcha = req.app.locals.captcha || {};

    if (captcha.token !== piccaptcha.toUpperCase()) {
      return res.send({
        status: 0,
        message: '图形验证码不正确'
      });
    } else if (Date.now() > captcha.expired) {
      return res.send({
        status: 0,
        message: '图形验证码已过期'
      });
    }

    try {
      await getSmsCode({ mobile });

      req.app.locals.sms_code = {
        mobile,
        expired: Date.now() + 1000 * 60 * 10
      };

      return res.send({
        status: 1
      });
    } catch(err) {
      return res.send({
        status: 0,
        message: err.message
      });
    }
  }
}

module.exports = new Captcha();
