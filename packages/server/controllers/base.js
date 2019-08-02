const fs = require('fs');
const bcrypt = require('bcryptjs');
const qiniu = require('qiniu');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const {
  qn: { ACCESS_KEY, SECRET_KEY, BUCKET_NAME, ZONE },
  mail: { HOST, PORT, SECURE, AUTH },
  SALT_WORK_FACTOR,
} = require('../../../config');

module.exports = class Base {
  // 生成随机数
  _rand (min, max) {
    return Math.random() * (max - min + 1) + min | 0;
  }

  // 密码加密
  async _encryption(password) {
    const salt = await bcrypt.genSalt(SALT_WORK_FACTOR);
    const hash = await bcrypt.hash(password, salt);
    return hash;
  }

  // 密码比较
  async _comparePass(pass, passTrue) {
    const isMatch = await bcrypt.compare(pass, passTrue);
    return isMatch;
  }

  // md5加密
  async _md5(value) {
    const md5 = crypto.createHash('md5');
    return md5.update(value).digest('hex');
  }

  // 七牛图片上传
  _uploadImgByQn(name, local) {
    if (process.env.NODE_ENV === 'test') return '';

    const mac = new qiniu.auth.digest.Mac(ACCESS_KEY, SECRET_KEY);
    const putPolicy = new qiniu.rs.PutPolicy({
      scope: `${BUCKET_NAME}:${name}`
    });

    const uploadToken = putPolicy.uploadToken(mac);

    const config = new qiniu.conf.Config();
    config.zone = qiniu.zone[ZONE];
    const formUploader = new qiniu.form_up.FormUploader(config);
    const putExtra = new qiniu.form_up.PutExtra();

    return new Promise((resolve, reject) => {
      formUploader.putFile(uploadToken, name, local, putExtra, (err, body, info) => {
        fs.unlinkSync(local);
        if (err) reject(err);
        if (info.statusCode === 200) {
          resolve(body.key);
        } else {
          reject(body.error);
        }
      });
    });
  }

  // 邮件发送
  _sendMail(email, content) {
    if (process.env.NODE_ENV === 'test') return '';

    const transporter = nodemailer.createTransport({
      host: HOST,
      port: PORT,
      secure: SECURE,
      auth: AUTH,
    });

    const opts = {
      from: 'Mints(薄荷糖社区) <email@mintsweet.cn>',
      to: email,
      html: content,
    };

    return new Promise((resolve, reject) => {
      transporter.sendMail(opts, (err, info) => {
        if (err) reject(err);
        resolve(info);
      });
    });
  }
};
