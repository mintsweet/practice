const moment = require('moment');
const UserProxy = require('../../proxy/user');

class User {
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
    const users = await UserProxy.getUsersByQuery();
    ctx.body = users;
  }

  // 创建用户
  createUser(ctx) {

  }

  // 删除用户(超管物理删除)
  deleteUser(ctx) {

  }

  // 编辑用户
  editUser(ctx) {

  }

  // 设为星标用户
  starUser(ctx) {

  }

  // 锁定用户(封号)
  lockUser(ctx) {

  }
}

module.exports = new User();
