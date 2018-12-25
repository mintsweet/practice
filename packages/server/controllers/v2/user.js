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
}

module.exports = new User();
