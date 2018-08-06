const moment = require('moment');
const TopicProxy = require('../../proxy/topic');

class Topic {
  // 本周新增话题数
  async countTopicThisWeek(ctx) {
    const start = moment().startOf('week');
    const end = moment().endOf('week');
    const count = await TopicProxy.countTopicByQuery({
      create_at: { $gte: start, $lt: end }
    });
    ctx.body = count;
  }

  // 上周新增话题数
  async countTopicLastWeek(ctx) {
    const start = moment().startOf('week').subtract(1, 'w');
    const end = moment().endOf('week').subtract(1, 'w');
    const count = await TopicProxy.countTopicByQuery({
      create_at: { $gte: start, $lt: end }
    });
    ctx.body = count;
  }

  // 统计话题总数
  async countTopicTotal(ctx) {
    const count = await TopicProxy.countTopicByQuery();
    ctx.body = count;
  }

  // 删除话题(超管物理删除)
  deleteTopic(ctx) {

  }

  // 话题置顶
  topTopic(ctx) {

  }

  // 话题加精华
  goodTopic(ctx) {

  }

  // 话题锁定(封贴)
  lockTopic(ctx) {

  }
}

module.exports = new Topic();
