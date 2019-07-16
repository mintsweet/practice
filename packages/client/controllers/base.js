const API = require('../utils/api');

module.exports = class Base {
  async getCaptchaUrl(req) {
    const data = await API.getCaptcha({
      height: 34,
    });

    req.session.captcha = {
      token: data.token,
      expired: Date.now() + 1000 * 60 * 10,
    };

    return data.url;
  }
};
