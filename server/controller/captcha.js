const BaseComponent = require('../prototype/BaseComponent');
const { BMP24 } = require('gd-bmp');

class Captcha extends BaseComponent {
  constructor() {
    super();
    this.getPicCaptcha = this.getPicCaptcha.bind(this);
  }

  rand (min, max) {
    return Math.random() * (max - min + 1) + min | 0;
  }

  getPicCaptcha(req, res) {
    const width = req.query.width || 100;
    const height = req.query.height || 40;
    const textColor = req.query.textColor || 'a1a1a1';
    const bgColor = req.query.bgColor || 'ffffff';

    const img = new BMP24(width, height, `0x${textColor}`);
    let token = '';

    // 设置背景
    img.fillRect(0, 0, width, height, `0x${bgColor}`);
    // 随机字符列表
    const p = 'ABCDEFGHIJKLMNPQRSTUVWXYZ123456789';
    // 组成token
    for (let i = 0; i < 5; i++) {
      token += p.charAt(Math.random() * p.length | 0);
    }

    // 字符定位于背景 x,y 轴位置
    let x = 10, y = 2;

    for (let i = 0; i < token.length; i++) {
      y = 2 + this.rand(-4, 4);

      img.drawChar(token[i], x, y, BMP24.font12x24, '0xa1a1a1');

      x += 12 + this.rand(4, 8);
    }

    const url = `data:image/bmp;base64,${img.getFileData().toString('base64')}`;

    req.session.pic_token = {
      token,
      time: Date.now()
    };

    return res.send({
      status: 1,
      data: {
        token,
        url
      }
    });
  }

  async getSmsCaptcha(req, res) {
    const { mobile, expired } = req.query;

    if (!mobile || !/^1[3,5,7,8,9]\w{9}$/.test(mobile)) {
      return res.send({
        status: 0,
        type: 'ERROR_MOBILE_IS_INVALID',
        message: '手机号格式不正确'
      });
    }

    let code = '';

    for (let i = 0; i < 6; i++) {
      code += Math.floor(Math.random() * 10);
    }

    req.session.sms_code = {
      mobile,
      code: code.toString(),
      expired: Date.now() + Number(expired || (1000 * 60 * 10)) 
    };

    process.env === 'development' && console.warn(code);

    return res.send({
      status: 1,
      code: process.env === 'production' ? '' : code
    });
  }
}

module.exports = new Captcha();
