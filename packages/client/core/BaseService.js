const API = require('../utils/api');

module.exports = class BaseService {
  async _getCaptchaUrl(req) {
    const data = await API.getCaptcha({
      height: 34,
    });

    req.session.captcha = {
      token: data.token,
      expired: Date.now() + 1000 * 60 * 3,
    };

    return data.url;
  }
};
