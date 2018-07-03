const { getPicCaptcha, getSmsCaptcha } = require('../http/api');

class Captcha {
  async getPicCaptcha(req, res) {
    const response = await getPicCaptcha();
    if (response.status === 1) {
      req.app.locals.pic_token = response.data.token;
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
    if (piccaptcha.toLowerCase() !== req.app.locals.pic_token.toLowerCase()) {
      return res.send({
        status: 0,
        message: '图形验证码不正确'
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
