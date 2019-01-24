const API = require('../utils/api');

class Aider {
  async getCaptcha(req, res) {
    const data = await API.getCaptcha({
      height: 34
    });

    req.app.locals.captcha = {
      token: data.token,
      expired: Date.now() + 1000 * 60 * 10
    };

    return res.send({
      status: 1,
      url: data.url
    });
  }
}

module.exports = new Aider();
