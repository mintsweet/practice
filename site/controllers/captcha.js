const { getPicCaptcha, getSmsCaptcha } = require('../http/api');

class Captcha {
  async getPicCaptcha(req, res) {
    const data = await getPicCaptcha();

    req.app.locals.pic_token = {
      token: data.token,
      expired: Date.now() + 1000 * 60 * 5
    };

    return res.send({
      status: 1,
      data: data.url
    });
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

    await getSmsCaptcha({ mobile });

    req.app.locals.sms_code = {
      mobile,
      expired: Date.now() + 1000 * 60 * 10
    };

    return res.send({
      status: 1
    });
  }
}

module.exports = new Captcha();
