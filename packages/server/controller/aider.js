const fs = require('fs');
const path = require('path');
const { BMP24 } = require('gd-bmp');
const moment = require('moment');
const UserModel = require('../model/user');
const TopicModel = require('../model/topic');

class Aider {
  constructor() {
    this.getCaptcha = this.getCaptcha.bind(this);
  }

  // 生成随机数
  _rand(min, max) {
    return (Math.random() * (max - min + 1) + min) | 0;
  }

  getCaptcha(ctx) {
    const {
      width = 100,
      height = 40,
      textColor = 'a1a1a1',
      bgColor = 'ffffff',
    } = ctx.query;

    // 设置画布
    const img = new BMP24(width, height);
    // 设置背景
    img.fillRect(0, 0, width, height, `0x${bgColor}`);

    let token = '';

    // 随机字符列表
    const p = 'ABCDEFGHIJKLMNPQRSTUVWXYZ123456789';
    // 组成token
    for (let i = 0; i < 5; i++) {
      token += p.charAt((Math.random() * p.length) | 0);
    }

    // 字符定位于背景 x,y 轴位置
    let x = 10,
      y = 2;

    for (let i = 0; i < token.length; i++) {
      y = 2 + this._rand(-4, 4);
      // 画字符
      img.drawChar(token[i], x, y, BMP24.font12x24, `0x${textColor}`);
      x += 12 + this._rand(4, 8);
    }

    const url = `data:image/bmp;base64,${img.getFileData().toString('base64')}`;

    ctx.body = { token, url };
  }

  // 上传文件
  async upload(ctx) {
    const { id } = ctx.state.user;
    const { file } = ctx.request.files;

    if (!file) {
      ctx.throw(400, '请上传文件');
    }

    const filename = `avatar_${id}${path.extname(file.path)}`;

    await new Promise((resolve, reject) => {
      fs.rename(file.path, `${path.dirname(file.path)}/${filename}`, err => {
        if (err) reject(err);
        resolve();
      });
    });

    ctx.body = filename;
  }

  // 获取文件
  async getFile(ctx) {
    const { filename } = ctx.params;
    const file = path.join(__dirname, '../upload', filename);
    ctx.set('Content-Type', 'image/png');
    ctx.body = fs.readFileSync(file);
  }

  // 获取系统概览
  async dashboard(ctx) {
    const curWeekStart = moment().startOf('week');
    const curWeekEnd = moment().endOf('week');
    const preWeekStart = moment()
      .startOf('week')
      .subtract(1, 'w');
    const preWeekEnd = moment()
      .endOf('week')
      .subtract(1, 'w');

    // 本周新增用户数, 上周新增用户数, 用户总数
    const [curWeekAddUser, preWeekAddUser, userTotal] = await Promise.all([
      UserModel.countDocuments({
        created_at: {
          $gte: curWeekStart,
          $lt: curWeekEnd,
        },
      }),
      UserModel.countDocuments({
        created_at: {
          $gte: preWeekStart,
          $lt: preWeekEnd,
        },
      }),
      UserModel.countDocuments(),
    ]);

    // 本周新增话题数, 上周新增话题数, 话题总数
    const [curWeekAddTopic, preWeekAddTopic, topicTotal] = await Promise.all([
      TopicModel.countDocuments({
        created_at: {
          $gte: curWeekStart,
          $lt: curWeekEnd,
        },
      }),
      TopicModel.countDocuments({
        created_at: {
          $gte: preWeekStart,
          $lt: preWeekEnd,
        },
      }),
      TopicModel.countDocuments(),
    ]);

    ctx.body = {
      curWeekAddUser,
      preWeekAddUser,
      userTotal,
      curWeekAddTopic,
      preWeekAddTopic,
      topicTotal,
    };
  }
}

module.exports = new Aider();
