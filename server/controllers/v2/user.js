const UserProxy = require('../../proxy/user');

class User {
  // 统计用户总数
  async countUserTotal(ctx) {
    const count = await UserProxy.countUserByQuery();
    ctx.body = count;
  }
}

module.exports = new User();
