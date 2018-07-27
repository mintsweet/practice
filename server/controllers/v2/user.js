const UserProxy = require('../../proxy/user');

class User {
  getCountNewToday(ctx) {
    ctx.body = '我是管理员';
  }
}

module.exports = new User();