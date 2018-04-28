import chalk from 'chalk';
import { BMP24 } from 'gd-bmp';
import Ids from '../models/ids';

export default class BaseComponent {
  constructor() {
    this.idList = ['admin_id', 'user_id', 'genre_id', 'post_id', 'mood_id'];
  }

  async getId(type) {
    if(!this.idList.includes(type)) {
      console.error(`${type} ${chalk.redBright('Id 类型错误!')}`);
      return;
    }
    try {
      const idData = await Ids.findOne();
      idData[type]++;
      await idData.save();
      return idData[type];
    } catch(err) {
      console.error(`${chalk.redBright('获取id数据失败')}`);
      return false;
    }
  }

  rand (min, max) {
    return Math.random() * (max - min + 1) + min | 0;
  }

  drawCode () {
    const img = new BMP24(117, 40);
    let token = '';
    img.fillRect(0, 0, 117, 40, '0xffffff');
    
    const p = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789';

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

    return { token, url };
  }
}