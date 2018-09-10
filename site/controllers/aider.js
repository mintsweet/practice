const { getCaptcha, getSmsCode } = require('../http/api');

class Captcha {
  async getCaptcha(req, res) {
    try {
      const data = await getCaptcha();

      req.app.locals.captcha = {
        token: data.token,
        expired: Date.now() + 1000 * 60 * 10
      };

      return res.send({
        status: 1,
        data: process.env.NODE_ENV === 'test' ? data : data.url
      });
    } catch(err) {
      return res.send({
        status: 0,
        message: err.error
      });
    }
  }

  async getSmsCode(req, res) {
    const { piccaptcha, mobile } = req.query;
    const captcha = req.app.locals.captcha || {};
    const env = process.env.NODE_ENV;

    if (env !== 'test') {
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
    }

    try {
      const code = await getSmsCode({ mobile });

      req.app.locals.sms_code = {
        mobile,
        expired: Date.now() + 1000 * 60 * 10
      };

      return res.send({
        status: 1,
        data: code
      });
    } catch(err) {
      return res.send({
        status: 0,
        message: err.error
      });
    }
  }
}

module.exports = new Captcha();
