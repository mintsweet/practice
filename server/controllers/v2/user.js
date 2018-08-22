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
    const page = parseInt(ctx.query.page) || 1;
    const size = parseInt(ctx.query.size) || 10;

    const option = {
      skip: (page - 1) * size,
      limit: size,
      sort: 'create_at'
    };

    const total = await UserProxy.countUserByQuery({});
    const users = await UserProxy.getUsersByQuery({}, '-password', option);
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
    const { mobile, password, nickname, role } = ctx.request.body;

    try {
      if (!mobile || !/^1[3,5,7,8,9]\d{9}$/.test(mobile)) {
        throw new Error('手机号格式不正确');
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
    const currentUser = await UserProxy.getUserById(uid);

    if (currentUser.role > 100) {
      ctx.throw(401, '无法删除超级管理员');
    }

    await UserProxy.removeUserById(uid);
    ctx.body = '';
  }

  // 设为星标用户
  async starUser(ctx) {
    const { uid } = ctx.params;
    const { user: currentUser } = ctx.state;

    if (currentUser.id === uid) {
      ctx.throw(403, '不能操作自身');
    }

    const user = await UserProxy.getUserById(uid);

    if (currentUser.role < user.role) {
      ctx.throw(403, '不能操作权限值高于自身的用户');
    }

    if (user.star) {
      await UserProxy.updateUserById(uid, { star: false });
    } else {
      await UserProxy.updateUserById(uid, { star: true });
    }

    const action = user.star ? 'un_star' : 'star';

    ctx.body = action;
  }

  // 锁定用户(封号)
  async lockUser(ctx) {
    const { uid } = ctx.params;
    const { user: currentUser } = ctx.state;

    if (currentUser.id === uid) {
      ctx.throw(403, '不能操作自身');
    }

    const user = await UserProxy.getUserById(uid);

    if (currentUser.role < user.role) {
      ctx.throw(403, '不能操作权限值高于自身的用户');
    }

    if (user.lock) {
      await UserProxy.updateUserById(uid, { lock: false });
    } else {
      await UserProxy.updateUserById(uid, { lock: true });
    }

    const action = user.lock ? 'un_lock' : 'lock';

    ctx.body = action;
  }
}

module.exports = new User();
