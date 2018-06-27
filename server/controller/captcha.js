const BaseComponent = require('../prototype/BaseComponent');
const { BMP24 } = require('gd-bmp');

class Common extends BaseComponent {
  constructor() {
    super();
    this.getPicCaptcha = this.getPicCaptcha.bind(this);
  }

  rand (min, max) {
    return Math.random() * (max - min + 1) + min | 0;
  }

  getPicCaptcha(req, res) {
    const img = new BMP24(100, 38);

    let token = '';

    img.fillRect(0, 0, 100, 38, '0xffffff');
    
    const p = 'ABCDEFGHIJKLMNPQRSTUVWXYZ123456789';

    for (let i=0; i < 5; i ++) {
      token += p.charAt(Math.random() * p.length | 0 );
    }

    let x = 10, y = 2;
    
    for (let i = 0; i < token.length; i ++) {
      y = 2 + this.rand(-4, 4);

      img.drawChar(token[i], x, y, BMP24.font12x24, '0xa1a1a1');

      x += 12 + this.rand(4, 8);
    }

    const url = 'data:image/bmp;base64,' + img.getFileData().toString('base64');

    try {
      req.session.pic_token = {
        token,
        time: Date.now()
      }
      return res.send({
        status: 1,
        data: {
          token,
          url
        }
      })
    } catch (err) {
      return res.send({
        status: 0,
        type: 'ERROR_GET_PIC_CAPTCHA',
        message: '获取图形验证码失败'
      });
    }
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

      req.session.msg_code = {
        mobile: mobile,
        code: code.toString(),
        time: Date.now()
      }

      return res.send({
        status: 1,
        code
      });
    } catch (err) {
      return  res.send({
        status: 0,
        type: 'ERROR_GET_MSG_CAPTCHA',
        message: '获取短信验证码失败'
      });
    }
  }
}

module.exports = new Common();