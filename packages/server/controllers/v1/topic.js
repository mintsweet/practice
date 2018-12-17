const TopicProxy = require('../../proxy/topic');
const UserProxy = require('../../proxy/user');
const ActionProxy = require('../../proxy/action');
const config = require('../../config');

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
    const topic = await TopicProxy.create({
      tab,
      title,
      content,
      author_id: id
    });

    // 查询作者
    const author = await UserProxy.getById(id);

    // 积分累计
    author.score += 1;
    // 话题数量累计
    author.topic_count += 1;
    // 更新用户信息
    await author.save();

    // 创建行为
    await ActionProxy.create({
      type: 'create',
      author_id: author.id,
      target_id: topic.id
    });

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
    const author = await UserProxy.getById(topic.author_id);

    // 积分减去
    author.score -= 1;
    // 话题数量减少
    author.topic_count -= 1;
    // 更新用户信息
    await author.save();

    // 更新行为
    const conditions = {
      type: 'create',
      author_id: author.id,
      target_id: topic.id
    };

    const action = await ActionProxy.getOne(conditions);

    await ActionProxy.update(conditions, {
      ...action.toObject(),
      is_un: true
    });

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

    await TopicProxy.update({ id: tid }, {
      ...topic.toObject(),
      tab,
      title,
      content
    });

    ctx.body = '';
  }

  // 获取列表
  async getTopicList(ctx) {
    const tab = ctx.query.tab || 'all';
    const page = parseInt(ctx.query.page) || 1;
    const size = parseInt(ctx.query.size) || 10;

    let query = {
      lock: false,
      delete: false
    };

    if (!tab || tab === 'all') {
      query = {
        lock: false,
        delete: false
      };
    } else if (tab === 'good') {
      query.good = true;
    } else {
      query.tab = tab;
    }

    const options = {
      skip: (page - 1) * size,
      limit: size,
      sort: '-top -last_reply_at'
    };

    const count = await TopicProxy.count(query);
    const topics = await TopicProxy.get(query, '-lock -delete', options);

    const promiseAuthor = await Promise.all(topics.map(item => {
      return new Promise(resolve => {
        resolve(UserProxy.getById(item.author_id, 'id nickname avatar'));
      });
    }));

    const promiseLastReply = await Promise.all(topics.map(item => {
      return new Promise(resolve => {
        resolve(UserProxy.getById(item.last_reply, 'id nickname avatar'));
      });
    }));

    const list = topics.map((item, i) => {
      return {
        ...item.toObject({
          virtuals: true
        }),
        author: promiseAuthor[i],
        last_reply_author: promiseLastReply[i],
        last_reply_at_ago: item.last_reply_at_ago()
      };
    });

    ctx.body = {
      topics: list,
      currentPage: page,
      total: count,
      totalPage: Math.ceil(count / size),
      currentTab: tab,
      tabs: config.tabs,
      size
    };
  }

  // 搜索话题
  async searchTopic(ctx) {
    const title = ctx.query.title || '';
    const page = parseInt(ctx.query.page) || 1;
    const size = parseInt(ctx.query.size) || 10;

    const query = {
      title: { $regex: title },
      lock: false,
      delete: false
    };

    const option = {
      skip: (page - 1) * size,
      limit: size,
      sort: '-top -last_reply_at'
    };

    const count = await TopicProxy.count(query);
    const topics = await TopicProxy.get(query, '-lock -delete', option);

    const promiseAuthor = await Promise.all(topics.map(item => {
      return new Promise(resolve => {
        resolve(UserProxy.getById(item.author_id, 'id nickname avatar'));
      });
    }));

    const promiseLastReply = await Promise.all(topics.map(item => {
      return new Promise(resolve => {
        resolve(UserProxy.getById(item.last_reply, 'id nickname avatar'));
      });
    }));

    const list = topics.map((item, i) => {
      return {
        ...item.toObject({
          virtuals: true
        }),
        author: promiseAuthor[i],
        last_reply_author: promiseLastReply[i],
        last_reply_at_ago: item.last_reply_at_ago()
      };
    });

    ctx.body = {
      topics: list,
      currentPage: page,
      total: count,
      totalPage: Math.ceil(count / size),
      size
    };
  }
}

module.exports = new Topic();
