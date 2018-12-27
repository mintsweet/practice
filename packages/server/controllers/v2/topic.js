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
}

module.exports = new Topic();
