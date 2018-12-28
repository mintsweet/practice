const moment = require('moment');
const TopicProxy = require('../../proxy/topic');

class Topic {
  // 本周新增话题数
  async countTopicThisWeek(ctx) {
    const start = moment().startOf('week');
    const end = moment().endOf('week');

    const count = await TopicProxy.count({
      create_at: { $gte: start, $lt: end }
    });

    ctx.body = count;
  }

  // 上周新增话题数
  async countTopicLastWeek(ctx) {
    const start = moment().startOf('week').subtract(1, 'w');
    const end = moment().endOf('week').subtract(1, 'w');

    const count = await TopicProxy.count({
      create_at: { $gte: start, $lt: end }
    });

    ctx.body = count;
  }

  // 统计话题总数
  async countTopicTotal(ctx) {
    const count = await TopicProxy.count();

    ctx.body = count;
  }

  // 删除话题(超管物理删除)
  async deleteTopic(ctx) {
    const { tid } = ctx.params;

    await TopicProxy.deleteById(tid);

    ctx.body = '';
  }
}

module.exports = new Topic();
