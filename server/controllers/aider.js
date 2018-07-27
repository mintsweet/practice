const { BMP24 } = require('gd-bmp');

class Aider {
  constructor() {
    this.getCaptcha = this.getCaptcha.bind(this);
  }

  _rand (min, max) {
    return Math.random() * (max - min + 1) + min | 0;
  }

  getCaptcha(req, res) {
    const width = req.query.width || 100;
    const height = req.query.height || 40;
    const bgColor = req.query.bgColor || 'ffffff';
    const textColor = req.query.textColor || 'a1a1a1';

    // 设置画布
    const img = new BMP24(width, height, `0x${textColor}`);
    // 设置背景
    img.fillRect(0, 0, width, height, `0x${bgColor}`);

    let token = '';

    // 随机字符列表 去除 0 和 o 防止混淆
    const p = 'ABCDEFGHIJKLMNPQRSTUVWXYZ123456789';
    // 组成token
    for (let i = 0; i < 5; i++) {
      token += p.charAt(Math.random() * p.length | 0);
    }

    // 字符定位于背景 x,y 轴位置
    let x = 10, y = 2;

    for (let i = 0; i < token.length; i++) {
      y = 2 + this._rand(-4, 4);
      // 画字符
      img.drawChar(token[i], x, y, BMP24.font12x24, '0xa1a1a1');
      x += 12 + this._rand(4, 8);
    }

    const url = `data:image/bmp;base64,${img.getFileData().toString('base64')}`;

    return res.send({
      status: 1,
      data: { token, url }
    });
  }

  getSmsCode(req, res) {
    const { mobile, expired } = req.query;

    if (!mobile || !/^1[3,5,7,8,9]\d{9}$/.test(mobile)) {
      return res.send({
        status: 0,
        message: '手机号格式不正确'
      });
    }

    let code = '';

    for (let i = 0; i < 6; i++) {
      code += Math.floor(Math.random() * 10);
    }

    req.session.sms_code = { mobile, code, expired: expired || 1000 * 60 * 5 };

    if (process.env.NODE_ENV === 'production') {
      return res.send({
        status: 1
      });
    } else {
      return res.send({
        status: 1,
        code
      });
    }
  }
}

module.exports = new Aider();
