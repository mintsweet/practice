const TopicProxy = require('../../proxy/topic');
const UserProxy = require('../../proxy/user');
const ActionProxy = require('../../proxy/action');

class Topic {
  // 创建话题
  async createTopic(ctx) {
    const { id } = ctx.state.user;
    const { tab, title, content } = ctx.request.body;

    try {
      if (!tab) {
        throw new Error('话题所属标签不能为空');
      } else if (!title) {
        throw new Error('话题标题不能为空');
      } else if (!content) {
        throw new Error('话题内容不能为空');
      }
    } catch(err) {
      ctx.throw(400, err.message);
    }

    // 创建话题
    const topic = await TopicProxy.create(tab, title, content, id);

    // 查询作者
    const author = await UserProxy.getUserById(id);

    // 积分累计
    author.score += 1;
    // 话题数量累计
    author.topic_count += 1;
    // 更新用户信息
    await author.save();

    // 创建行为
    await ActionProxy.createAction('create', author.id, topic.id);

    ctx.body = '';
  }
}

module.exports = new Topic();
