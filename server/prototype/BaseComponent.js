const { BMP24 } = require('gd-bmp');

module.exports = class BaseComponent {
  rand (min, max) {
    return Math.random() * (max - min + 1) + min | 0;
  }

  drawCode () {
    const img = new BMP24(100, 38);
    let token = '';
    img.fillRect(0, 0, 100, 38, '0xffffff');
    
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
