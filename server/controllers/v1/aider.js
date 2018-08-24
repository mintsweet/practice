const { BMP24 } = require('gd-bmp');
const logger = require('../../utils/logger');
const { setRedis } = require('../../db');

class Aider {
  constructor() {
    this.getCaptcha = this.getCaptcha.bind(this);
  }

  _rand (min, max) {
    return Math.random() * (max - min + 1) + min | 0;
  }

  getCaptcha(ctx) {
    const width = ctx.query.width || 100;
    const height = ctx.query.height || 40;
    const textColor = ctx.query.textColor || 'a1a1a1';
    const bgColor = ctx.query.bgColor || 'ffffff';

    // 设置画布
    const img = new BMP24(width, height, `0x${textColor}`);
    // 设置背景
    img.fillRect(0, 0, width, height, `0x${bgColor}`);

    let token = '';

    // 随机字符列表
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

    ctx.body = { token, url };
  }

  async getSmscode(ctx) {
    const { mobile } = ctx.query;
    const expired = ctx.query.expired || 1000 * 60 * 5;

    if (!mobile || !/^1[3,5,7,8,9]\d{9}$/.test(mobile)) {
      ctx.throw(400, '手机号格式不正确');
    }

    let code = '';

    for (let i = 0; i < 6; i++) {
      code += Math.floor(Math.random() * 10);
    }

    await setRedis(mobile, code, 'PX', expired);

    if (process.env.NODE_ENV === 'test') {
      ctx.body = code;
    } else {
      logger.debug(`${mobile}: ${code}`);
      ctx.body = '';
    }
  }
}

module.exports = new Aider();
