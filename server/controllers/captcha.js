const { BMP24 } = require('gd-bmp');
const qiniu = require('qiniu');
const config = require('../../config.default');

class Captcha {
  constructor() {
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

    process.env.NODE_ENV === 'development' && console.warn(code);

    return res.send({
      status: 1,
      code: process.env.NODE_ENV === 'test' ? code : ''
    });
  }

  uploadPic(req, res) {
    const { file: { path } } = req.body;
    const { id } = req.session.user;
    const name = `avatar_${id}`;

    const mac = new qiniu.auth.digest.Mac(config.qiniu.ACCESS_KEY, config.qiniu.SECRET_KEY);
    const putPolicy = new qiniu.rs.PutPolicy({
      scope: `${config.qiniu.BUCKET_NAME}:${name}`
    });

    const uploadToken = putPolicy.uploadToken(mac);
    const qiniuConfig = new qiniu.conf.Config();
    // 空间对应机房
    // 华东:qiniu.zone.Zone_z0
    // 华北:qiniu.zone.Zone_z1
    // 华南:qiniu.zone.Zone_z2
    // 北美:qiniu.zone.Zone_na0
    qiniuConfig.zone = qiniu.zone.Zone_z0;

    const formUploader = new qiniu.form_up.FormUploader(qiniuConfig);
    const putExtra = new qiniu.form_up.PutExtra();
    // 文件上传
    formUploader.putFile(uploadToken, name, path, putExtra, function(err, body, info) {
      if (err) {
        throw new Error(err);
      }
      if (info.statusCode === 200) {
        const url = `${config.qiniu.DONAME}/${body.key}}?date=${Date.now()}`;
        return res.send({
          status: 1,
          data: url
        });
      } else {
        throw new Error(info.error);
      }
    });
  }
}

module.exports = new Captcha();
