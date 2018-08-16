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

  // 获取话题列表
  async getTopicList(ctx) {
    const page = parseInt(ctx.query.page) || 1;
    const size = parseInt(ctx.query.size) || 10;

    const option = {
      skip: (page - 1) * size,
      limit: size,
      sort: 'create_at'
    };

    const total = await TopicProxy.countTopicByQuery({});
    const topics = await TopicProxy.getTopicsByQuery({}, '', option);
    const list = topics.map(item => {
      return {
        ...item.toObject(),
        create_at: moment(item.create_at).format('YYYY-MM-DD HH:mm')
      };
    });

    ctx.body = {
      topics: list,
      page,
      size,
      total
    };
  }

  // 删除话题(超管物理删除)
  async deleteTopic(ctx) {
    const { tid } = ctx.params;
    await TopicProxy.deleteTopicById(tid);
    ctx.body = '';
  }

  // 话题置顶
  async topTopic(ctx) {
    const { tid } = ctx.params;
    const topic = await TopicProxy.getTopicById(tid);

    if (topic.top) {
      await TopicProxy.updateTopicById(tid, { top: false });
    } else {
      await TopicProxy.updateTopicById(tid, { top: true });
    }

    const action = topic.top ? 'un_top' : 'top';

    ctx.body = action;
  }

  // 话题加精华
  async goodTopic(ctx) {
    const { tid } = ctx.params;
    const topic = await TopicProxy.getTopicById(tid);

    if (topic.good) {
      await TopicProxy.updateTopicById(tid, { good: false });
    } else {
      await TopicProxy.updateTopicById(tid, { good: true });
    }

    const action = topic.top ? 'un_good' : 'good';

    ctx.body = action;
  }

  // 话题锁定(封贴)
  async lockTopic(ctx) {
    const { tid } = ctx.params;
    const topic = await TopicProxy.getTopicById(tid);

    if (topic.lock) {
      await TopicProxy.updateTopicById(tid, { lock: false });
    } else {
      await TopicProxy.updateTopicById(tid, { lock: true });
    }

    const action = topic.top ? 'un_lock' : 'lock';

    ctx.body = action;
  }
}

module.exports = new Topic();
