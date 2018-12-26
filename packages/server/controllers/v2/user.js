const moment = require('moment');
const Base = require('../base');
const UserProxy = require('../../proxy/user');

class User extends Base {
  constructor() {
    super();
    this.createUser = this.createUser.bind(this);
  }

  // 本周新增用户数
  async countUserThisWeek(ctx) {
    const start = moment().startOf('week');
    const end = moment().endOf('week');

    const count = await UserProxy.count({
      create_at: { $gte: start, $lt: end }
    });

    ctx.body = count;
  }

  // 上周新增用户数
  async countUserLastWeek(ctx) {
    const start = moment().startOf('week').subtract(1, 'w');
    const end = moment().endOf('week').subtract(1, 'w');

    const count = await UserProxy.count({
      create_at: { $gte: start, $lt: end }
    });

    ctx.body = count;
  }

  // 统计用户总数
  async countUserTotal(ctx) {
    const count = await UserProxy.count();

    ctx.body = count;
  }

  // 用户列表
  async getUserList(ctx) {
    const page = parseInt(ctx.query.page) || 1;
    const size = parseInt(ctx.query.size) || 10;

    const option = {
      skip: (page - 1) * size,
      limit: size,
      sort: 'create_at'
    };

    const total = await UserProxy.count();
    const users = await UserProxy.get({}, '-password', option);

    const list = users.map(item => {
      return {
        ...item.toObject(),
        create_at: moment(item.create_at).format('YYYY-MM-DD HH:mm')
      };
    });

    ctx.body = {
      users: list,
      page,
      size,
      total
    };
  }

  // 创建用户
  async createUser(ctx) {
    const { user } = ctx.state;
    const { email, password, nickname, role } = ctx.request.body;

    try {
      if (!email || !/^([A-Za-z0-9_\-.])+@([A-Za-z0-9_\-.])+\.([A-Za-z]{2,4})$/.test(email)) {
        throw new Error('邮箱格式不正确');
      } else if (!password || !/(?!^(\d+|[a-zA-Z]+|[~!@#$%^&*?]+)$)^[\w~!@#$%^&*?].{6,18}/.test(password)) {
        throw new Error('密码必须为数字、字母和特殊字符其中两种组成并且在6至18位之间');
      } else if (!nickname || nickname.length > 8 || nickname.length < 2) {
        throw new Error('昵称必须在2至8位之间');
      } else if (user.role < role || role < 0 || role > 100) {
        throw new Error('权限值必须在0至100之间、且不能大于当前用户的权限值');
      }
    } catch(err) {
      ctx.throw(400, err.message);
    }

    let existUser;

    existUser = await UserProxy.getOne({ email });
    if (existUser) {
      ctx.throw(409, '手机号已经存在');
    }

    existUser = await UserProxy.getOne({ nickname });
    if (existUser) {
      ctx.throw(409, '昵称已经存在');
    }

    const bcryptPassword = await this._encryption(password);

    await UserProxy.create({
      email,
      password: bcryptPassword,
      nickname,
      role
    });

    ctx.body = '';
  }

  // 删除用户(超管物理删除)
  async deleteUser(ctx) {
    const { uid } = ctx.params;
    const currentUser = await UserProxy.getById(uid);

    if (currentUser.role > 100) {
      ctx.throw(401, '无法删除超级管理员');
    }

    await UserProxy.deleteById(uid);

    ctx.body = '';
  }

  // 设为星标用户
  async starUser(ctx) {
    const { uid } = ctx.params;
    const { user: currentUser } = ctx.state;

    if (currentUser.id === uid) {
      ctx.throw(403, '不能操作自身');
    }

    const user = await UserProxy.getById(uid);

    if (user.star) {
      user.star = false;
      await user.save();
    } else {
      user.star = true;
      await user.save();
    }

    const action = user.star ? 'star' : 'un_star';

    ctx.body = action;
  }

  // 锁定用户(封号)
  async lockUser(ctx) {
    const { uid } = ctx.params;
    const { user: currentUser } = ctx.state;

    if (currentUser.id === uid) {
      ctx.throw(403, '不能操作自身');
    }

    const user = await UserProxy.getById(uid);

    if (currentUser.role < user.role) {
      ctx.throw(403, '不能操作权限值高于自身的用户');
    }

    if (user.lock) {
      user.lock = false;
      await user.save();
    } else {
      user.lock = true;
      await user.save();
    }

    const action = user.lock ? 'lock' : 'un_lock';

    ctx.body = action;
  }
}

module.exports = new User();
