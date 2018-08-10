const moment = require('moment');
const bcrypt = require('bcryptjs');
const UserProxy = require('../../proxy/user');

class User {
  constructor() {
    this.SALT_WORK_FACTOR = 10;
    this.createUser = this.createUser.bind(this);
  }

  // 本周新增用户数
  async countUserThisWeek(ctx) {
    const start = moment().startOf('week');
    const end = moment().endOf('week');
    const count = await UserProxy.countUserByQuery({
      create_at: { $gte: start, $lt: end }
    });
    ctx.body = count;
  }

  // 上周新增用户数
  async countUserLastWeek(ctx) {
    const start = moment().startOf('week').subtract(1, 'w');
    const end = moment().endOf('week').subtract(1, 'w');
    const count = await UserProxy.countUserByQuery({
      create_at: { $gte: start, $lt: end }
    });
    ctx.body = count;
  }

  // 统计用户总数
  async countUserTotal(ctx) {
    const count = await UserProxy.countUserByQuery();
    ctx.body = count;
  }

  // 用户列表
  async getUserList(ctx) {
    const result = await UserProxy.getUsersByQuery({}, 'id avatar mobile nickname create_at delete lock star role score');
    const users = result.map(item => {
      return {
        ...item.toObject(),
        create_at: moment(item.create_at).format('YYYY-MM-DD HH:mm')
      };
    });

    ctx.body = users;
  }

  // 创建用户
  async createUser(ctx) {
    const { mobile, password, nickname, role } = ctx.request.body;

    try {
      if (!mobile || !/^1[3,5,7,8,9]\d{9}$/.test(mobile)) {
        throw new Error('手机号格式不正确');
      } else if (!password || !/(?!^(\d+|[a-zA-Z]+|[~!@#$%^&*?]+)$)^[\w~!@#$%^&*?].{6,18}/.test(password)) {
        throw new Error('密码必须为数字、字母和特殊字符其中两种组成并且在6至18位之间');
      } else if (!nickname || nickname.length > 8 || nickname.length < 2) {
        throw new Error('昵称必须在2至8位之间');
      }
    } catch(err) {
      ctx.throw(400, err.message);
    }

    let existUser;

    existUser = await UserProxy.getUserByMobile(mobile);
    if (existUser) {
      ctx.throw(409, '手机号已经存在');
    }

    existUser = await UserProxy.getUserByNickname(nickname);
    if (existUser) {
      ctx.throw(409, '昵称已经存在');
    }

    const bcryptPassword = await this._encryption(password);
    await UserProxy.createUser(mobile, bcryptPassword, nickname, { role });
    ctx.body = '';
  }

  // 密码加密
  async _encryption(password) {
    const salt = await bcrypt.genSalt(this.SALT_WORK_FACTOR);
    const hash = await bcrypt.hash(password, salt);
    return hash;
  }

  // 删除用户(超管物理删除)
  async deleteUser(ctx) {
    const { uid } = ctx.params;
    await UserProxy.deleteUser(uid);
    ctx.body = '';
  }

  // 设为星标用户
  async starUser(ctx) {
    const { uid } = ctx.params;
    await UserProxy.updateUserById(uid, { star: true });
    ctx.body = '';
  }

  // 锁定用户(封号)
  async lockUser(ctx) {
    const { uid } = ctx.params;
    await UserProxy.updateUserById(uid, { lock: true });
    ctx.body = '';
  }
}

module.exports = new User();
