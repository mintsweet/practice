const { getPicCaptcha, getMsgCaptcha } = require('../http/api');

class Common {
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

  async getMsgCaptcha(req, res) {
    const { piccaptcha, mobile } = req.query;
    if (piccaptcha.toLowerCase() !== req.app.locals.pic_token.toLowerCase()) {
      return res.send({
        status: 0,
        message: '图形验证码不正确'
      });
    }
    const response = await getMsgCaptcha({ mobile });
    if (response.status === 1) {
      req.app.locals.msg_code = response.data;
      return res.send({
        status: 1
      });
    } else {
      return res.send({
        status: 0,
        message: response.message
      });
    }
  }

  uploadImage(req, res) {
    
  }
}

module.exports = new Common();