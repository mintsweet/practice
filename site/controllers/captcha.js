const { getPicCaptcha, getSmsCaptcha } = require('../http/api');

class Captcha {
  async getPicCaptcha(req, res) {
    const response = await getPicCaptcha();
    if (response.status === 1) {
      req.app.locals.pic_token = {
        token: response.data.token,
        expired: Date.now() + 1000 * 60 * 5
      };
      return res.send({
        status: 1,
        data: response.data.url
      });
    } else {
      return res.send({
        status: 0,
        message: '获取图形验证码失败'
      });
    }
  }

  async getSmsCaptcha(req, res) {
    const { piccaptcha, mobile } = req.query;
    const { pic_token } = req.app.locals;

    if (pic_token && pic_token.token !== piccaptcha.toUpperCase()) {
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

    const response = await getSmsCaptcha({ mobile });
    if (response.status === 1) {
      req.app.locals.sms_code = {
        mobile,
        expired: Date.now() + 1000 * 60 * 10
      };
      return res.send({
        status: 1
      });
    } else {
      return res.send({
        status: 0,
        message: '获取短信验证码失败'
      });
    }
  }
}

module.exports = new Captcha();
