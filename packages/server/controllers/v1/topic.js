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
    await ActionProxy.create('create', author.id, topic.id);

    ctx.body = '';
  }

  // 删除话题
  async deleteTopic(ctx) {
    const { id } = ctx.state.user;
    const { tid } = ctx.params;

    const topic = await TopicProxy.getById(tid);

    if (!topic) {
      ctx.throw(404, '话题不存在');
    }

    if (!topic.author_id.equals(id)) {
      ctx.throw(403, '不能删除别人的话题');
    }

    // 改变为删除状态
    topic.delete = true;
    await topic.save();

    // 查询作者
    const author = await UserProxy.getUserById(topic.author_id);

    // 积分减去
    author.score -= 1;
    // 话题数量减少
    author.topic_count -= 1;
    // 更新用户信息
    await author.save();

    // 更新行为
    await ActionProxy.update('create', author.id, topic.id);

    ctx.body = '';
  }

  // 编辑话题
  async updateTopic(ctx) {
    const { id } = ctx.state.user;
    const { tid } = ctx.params;

    const topic = await TopicProxy.getById(tid);

    if (!topic) {
      ctx.throw(404, '话题不存在');
    }

    if (!topic.author_id.equals(id)) {
      ctx.throw(403, '不能编辑别人的话题');
    }

    // 更新内容
    const {
      tab = topic.tab,
      title = topic.title,
      content = topic.content
    } = ctx.request.body;

    topic.tab = tab;
    topic.title = title;
    topic.content = content;
    await topic.save();

    ctx.body = '';
  }
}

module.exports = new Topic();
