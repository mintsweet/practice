const moment = require('moment');
const UserProxy = require('../../proxy/user');

class User {
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
}

module.exports = new User();
