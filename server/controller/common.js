const BaseComponent = require('../prototype/BaseComponent');

class Common extends BaseComponent {
  constructor() {
    super();
    this.getPicCaptcha = this.getPicCaptcha.bind(this);
  }

  async getMsgCaptcha(req, res) {
    const { mobile } = req.query;

    if (!mobile || !/^1[3,5,7,8,9]\d{9}$/.test(mobile)) {
      return res.send({
        status: 0,
        type: 'ERROR_MOBILE_FORMAT',
        message: '手机号格式不正确'
      });
    }

    try {
      let code = '';
      for (let i = 0;i < 6; i++) {
        code += Math.floor(Math.random() * 10);
      };

      console.log(code);

      req.session.msg_code = {
        mobile,
        code,
        time: Date.now()
      }

      return res.send({
        status: 1
      });
    } catch (err) {
      return  res.send({
        status: 0,
        type: 'ERROR_GET_MSG_CAPTCHA',
        message: '获取短信验证码失败'
      });
    }
  }

  getPicCaptcha(req, res) {
    try {
      const picCaptcha = this.drawCode();
      req.session.pic_token = {
        token: picCaptcha.token,
        time: Date.now()
      }
      return res.send({
        status: 1,
        data: picCaptcha
      })
    } catch (err) {
      return res.send({
        status: 0,
        type: 'ERROR_GET_PIC_CAPTCHA',
        message: '获取图形验证码失败'
      });
    }
  }
}

module.exports = new Common();