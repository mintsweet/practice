const Base = require('./base');
const { getSmsCaptcha } = require('../http/api');

class Captcha extends Base {
  constructor() {
    super();
    this.getPicCaptcha = this.getPicCaptcha.bind(this);
  }

  async getPicCaptcha(req, res) {
    try {
      const url = await this.getPicCaptchaUrl(req);
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

  async getSmsCaptcha(req, res) {
    const { piccaptcha, mobile } = req.query;
    const pic_token = req.app.locals.pic_token || {};

    if (pic_token.token !== piccaptcha.toUpperCase()) {
      return res.send({
        status: 0,
        message: '图形验证码不正确'
      });
    } else if (Date.now() > pic_token.expired) {
      return res.send({
        status: 0,
        message: '图形验证码已过期'
      });
    }

    try {
      await getSmsCaptcha({ mobile });

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
