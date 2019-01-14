const fs = require('fs');
const bcrypt = require('bcryptjs');
const qiniu = require('qiniu');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const { qn, mail } = require('../config');

// 密码加密位数
const SALT_WORK_FACTOR = 10;

// 方便集成测试的时候同时隐藏七牛 access_key 和 secret_key
const QN_ACCESS_KEY = qn.ACCESS_KEY || process.env.QN_ACCESS_KEY;
const QN_SECRET_KEY = qn.SECRET_KEY || process.env.QN_SECRET_KEY;

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
    const mac = new qiniu.auth.digest.Mac(QN_ACCESS_KEY, QN_SECRET_KEY);
    const putPolicy = new qiniu.rs.PutPolicy({
      scope: `${qn.BUCKET_NAME}:${name}`
    });

    const uploadToken = putPolicy.uploadToken(mac);

    const config = new qiniu.conf.Config();
    config.zone = qiniu.zone[qn.ZONE];
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

  // 七牛图片删除
  static _deleteImgByQn(name) {
    const mac = new qiniu.auth.digest.Mac(QN_ACCESS_KEY, QN_SECRET_KEY);
    const config = new qiniu.conf.Config();
    config.zone = qiniu.zone.Zone_z0;
    const bucketManager = new qiniu.rs.BucketManager(mac, config);

    return new Promise((resolve, reject) => {
      bucketManager.delete(qn.BUCKET_NAME, name, (err, respBody, respInfo) => {
        if (err) reject(err);
        resolve(respInfo.statusCode);
      });
    });
  }

  // 邮件发送
  _sendMail(opts) {
    const transporter = nodemailer.createTransport(mail);

    return new Promise((resolve, reject) => {
      transporter.sendMail(opts, (err, info) => {
        if (err) reject(err);
        resolve(info);
      });
    });
  }
};
