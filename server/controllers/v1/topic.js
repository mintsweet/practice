const config = require('../../../config.default');
const TopicProxy = require('../../proxy/topic');
const UserProxy = require('../../proxy/user');
const ActionProxy = require('../../proxy/action');
const NoticeProxy = require('../../proxy/notice');
const ReplyProxy = require('../../proxy/reply');

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

    await TopicProxy.createTopic({ tab, title, content, author_id: id });

    ctx.body = '';
  }

  // 删除话题
  async deleteTopic(ctx) {
    const { id } = ctx.state.user;
    const { tid } = ctx.params;

    const topic = await TopicProxy.getTopicById(tid);

    if (!topic) {
      ctx.throw(410, '话题不存在');
    }

    if (!topic.author_id.equals(id)) {
      ctx.throw(403, '不能删除别人的话题');
    }

    // 改变为删除状态
    topic.delete = true;
    await topic.save();

    const author = await UserProxy.getUserById(topic.author_id);

    // 积分减去
    author.score -= 1;
    // 话题数量减少
    author.topic_count -= 1;
    // 更新用户信息
    await author.save();
    // 更新行为
    await ActionProxy.setAction('create', author.id, topic.id);

    ctx.body = '';
  }

  // 编辑话题
  async editTopic(ctx) {
    const { id } = ctx.state.user;
    const { tid } = ctx.params;

    const topic = await TopicProxy.getTopicById(tid);

    if (!topic) {
      ctx.throw(410, '话题不存在');
    }

    if (!topic.author_id.equals(id)) {
      ctx.throw(403, '不能编辑别人的话题');
    }

    const { tab, title, content } = ctx.request.body;

    // 更新内容
    topic.tab = tab || topic.tab;
    topic.title = title || topic.title;
    topic.content = content || topic.content;
    await topic.save();

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
      query = {};
    } else if (tab === 'good') {
      query.good = true;
    } else {
      query.tab = tab;
    }

    const option = {
      skip: (page - 1) * size,
      limit: size,
      sort: '-top -last_reply_at'
    };

    const count = await TopicProxy.countTopicByQuery(query);
    const topics = await TopicProxy.getTopicsByQuery(query, '-lock -delete', option);

    const promiseAuthor = await Promise.all(topics.map(item => {
      return new Promise(resolve => {
        resolve(UserProxy.getUserById(item.author_id, 'id nickname avatar'));
      });
    }));

    const promiseLastReply = await Promise.all(topics.map(item => {
      return new Promise(resolve => {
        resolve(UserProxy.getUserById(item.last_reply, 'id nickname avatar'));
      });
    }));

    const list = topics.map((item, i) => {
      return {
        ...item.toObject({ virtuals: true }),
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

    const count = await TopicProxy.countTopicByQuery(query);
    const topics = await TopicProxy.getTopicsByQuery(query, '-lock -delete', option);

    const promiseAuthor = await Promise.all(topics.map(item => {
      return new Promise(resolve => {
        resolve(UserProxy.getUserById(item.author_id, 'id nickname avatar'));
      });
    }));

    const promiseLastReply = await Promise.all(topics.map(item => {
      return new Promise(resolve => {
        resolve(UserProxy.getUserById(item.last_reply, 'id nickname avatar'));
      });
    }));

    const list = topics.map((item, i) => {
      return {
        ...item.toObject({ virtuals: true }),
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

  // 获取无人回复话题
  async getNoReplyTopic(ctx) {
    const query = {
      lock: false,
      delete: false,
      reply_count: 0
    };

    const options = {
      limit: 10,
      sort: '-top -good'
    };

    const topics = await TopicProxy.getTopicsByQuery(query, 'id title', options);

    ctx.body = topics;
  }

  // 获取话题详情
  async getTopicById(ctx) {
    const { tid } = ctx.params;

    const topic = await TopicProxy.getTopicById(tid);

    if (!topic) {
      ctx.throw(410, '话题不存在');
    }

    // 访问计数
    topic.visit_count += 1;
    await topic.save();

    // 作者
    const author = await UserProxy.getUserById(topic.author_id, 'id nickname avatar location signature score');
    // 回复
    let replies = await ReplyProxy.getReplyByQuery({ topic_id: topic.id });
    const reuslt = await Promise.all(replies.map(item => {
      return new Promise(resolve => {
        resolve(UserProxy.getUserById(item.author_id, 'id nickname avatar'));
      });
    }));

    replies = replies.map((item, i) => ({
      ...item.toObject(),
      author: reuslt[i],
      create_at_ago: item.create_at_ago()
    }));

    // 状态
    let like;
    let collect;

    const { user } = ctx.state;

    if (user) {
      like = await ActionProxy.getAction('like', user.id, topic.id);
      collect = await ActionProxy.getAction('collect', user.id, topic.id);
    }

    like = (like && !like.is_un) || false;
    collect = (collect && !collect.is_un) || false;

    ctx.body = {
      topic,
      author,
      replies,
      like,
      collect
    };
  }

  // 喜欢或者取消喜欢话题
  async likeOrUnLike(ctx) {
    const { id } = ctx.state.user;
    const { tid } = ctx.params;

    const topic = await TopicProxy.getTopicById(tid);

    if (!topic) {
      ctx.throw(410, '话题不存在');
    }

    if (topic.author_id.equals(id)) {
      ctx.throw(403, '不能喜欢自己的话题哟');
    }

    const author = await UserProxy.getUserById(topic.author_id);
    const action = await ActionProxy.setAction('like', id, topic.id);

    if (action.is_un) {
      topic.star_count -= 1;
      await topic.save();
      author.star_count -= 1;
      author.score -= 10;
      await author.save();
    } else {
      topic.star_count += 1;
      topic.save();
      author.star_count += 1;
      author.score += 10;
      await author.save();
      await NoticeProxy.createLikeNotice(id, topic.author_id, topic.id);
    }

    ctx.body = action.toObject({ virtuals: true }).actualType;
  }

  // 收藏或者取消收藏话题
  async collectOrUnCollect(ctx) {
    const { id } = ctx.state.user;
    const { tid } = ctx.params;

    const topic = await TopicProxy.getTopicById(tid);

    if (!topic) {
      ctx.throw(410, '话题不存在');
    }

    if (topic.author_id.equals(id)) {
      ctx.throw(403, '不能收藏自己的话题哟');
    }

    const author = await UserProxy.getUserById(topic.author_id);
    const action = await ActionProxy.setAction('collect', id, tid);

    if (action.is_un) {
      topic.collect_count -= 1;
      topic.save();
      author.collect_count -= 1;
      author.score -= 3;
      author.save();
    } else {
      topic.collect_count += 1;
      topic.save();
      author.collect_count += 1;
      author.score += 3;
      await author.save();
      await NoticeProxy.createCollectNotice(id, topic.author_id, topic.id);
    }

    ctx.body = action.toObject({ virtuals: true }).actualType;
  }
}

module.exports = new Topic();
