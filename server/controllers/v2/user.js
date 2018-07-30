const UserProxy = require('../../proxy/user');

class User {
  // 统计用户总数
  async countUser(ctx) {
    const count = await UserProxy.countUserByQuery();
    ctx.body = count;
  }

  // 统计今日新增用户数量
  async countNewToday(ctx) {
    const query = {};
    const count = await UserProxy.countUserByQuery(query);
    ctx.body = count;
  }
}

module.exports = new User();
