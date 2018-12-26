const { BMP24 } = require('gd-bmp');
const Base = require('../base');
const { qn } = require('../../config');

class Aider extends Base {
  constructor() {
    super();
    this.getCaptcha = this.getCaptcha.bind(this);
    this.uploadAvatar = this.uploadAvatar.bind(this);
  }

  getCaptcha(ctx) {
    const {
      width = 100,
      height = 40,
      textColor = 'a1a1a1',
      bgColor = 'fffff'
    } = ctx.query;

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

  async uploadAvatar(ctx) {
    const { id } = ctx.state.user;
    const { avatar } = ctx.request.files;

    try {
      const avatarName = await this._uploadImgByQn(`avatar_${id}.${avatar.path.split('.')[1]}`, avatar.path);
      ctx.body = `${qn.DONAME}/${avatarName}`;
    } catch(err) {
      throw new Error(err);
    }
  }
}

module.exports = new Aider();
