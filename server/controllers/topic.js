const TopicProxy = require('../proxy/topic');
const UserProxy = require('../proxy/user');
const ActionProxy = require('../proxy/action');
const NoticeProxy = require('../proxy/notice');

class Topic {
  // 创建话题
  async createTopic(req, res) {
    const { id } = req.session.user;
    const { tab, title, content } = req.body;

    try {
      if (!tab) {
        throw new Error('话题所属标签不能为空');
      } else if (!title) {
        throw new Error('话题标题不能为空');
      } else if (!content) {
        throw new Error('话题内容不能为空');
      }
    } catch(err) {
      return res.send({
        status: 0,
        message: err.message
      });
    }

    await TopicProxy.createTopic({ ...req.body, author_id: id });

    return res.send({
      status: 1
    });
  }

  // 删除话题
  async deleteTopic(req, res) {
    const { tid } = req.params;
    const { id } = req.session.user;

    const currentTopic = await TopicProxy.getTopicById(tid);

    if (!currentTopic) {
      return res.send({
        status: 0,
        message: '无效的ID'
      });
    }

    if (!currentTopic.author_id.equals(id)) {
      return res.send({
        status: 0,
        message: '不能删除别人的话题'
      });
    }

    await TopicProxy.deleteTopic(currentTopic.id);

    return res.send({
      status: 1
    });
  }

  // 编辑话题
  async editTopic(req, res) {
    const { tid } = req.params;
    const { id } = req.session.user;

    const currentTopic = await TopicProxy.getTopicById(tid);

    if (!currentTopic) {
      return res.send({
        status: 0,
        type: 'ERROR_ID_IS_INVALID',
        message: '无效的ID'
      });
    }

    if (!currentTopic.author_id.equals(id)) {
      return res.send({
        status: 0,
        type: 'ERROR_IS_NOT_AUTHOR',
        message: '不能编辑别人的话题'
      });
    }

    await TopicProxy.updateTopic({ ...req.body, tid });

    return res.send({
      status: 1
    });
  }

  // 获取列表
  async getTopicList(req, res) {
    const tab = req.query.tab || 'all';
    const page = parseInt(req.query.page) || 1;
    const size = parseInt(req.query.size) || 10;

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

    const options = {
      skip: (page - 1) * size,
      limit: size,
      sort: '-top -last_reply_at'
    };

    const count = await TopicProxy.countTopic(query);
    const topics = await TopicProxy.getTopicList(query, '-lock -delete', options);

    return res.send({
      status: 1,
      data: {
        topics,
        currentPage: page,
        total: count,
        totalPage: Math.ceil(count / size),
        tab,
        size
      },
    });
  }

  // 搜索话题
  async searchTopic(req, res) {
    const title = req.query.title || '';
    const page = parseInt(req.query.page) || 1;
    const size = parseInt(req.query.size) || 10;

    const query = {
      title: { $regex: title },
      lock: false,
      delete: false
    };

    const options = {
      skip: (page - 1) * size,
      limit: size,
      sort: '-top -last_reply_at'
    };

    const count = await TopicProxy.countTopic(query);
    const topics = await TopicProxy.getTopicList(query, '-lock -delete', options);

    return res.send({
      status: 1,
      data: {
        topics,
        currentPage: page,
        total: count,
        totalPage: Math.ceil(count / size),
        size
      },
    });
  }

  // 获取无人回复话题
  async getNoReplyTopic(req, res) {
    const query = {
      lock: false,
      delete: false,
      reply_count: 0
    };

    const options = {
      limit: 10,
      sort: '-top -good'
    };

    const topicList = await TopicProxy.getTopicsByQuery(query, 'id title', options);

    return res.send({
      status: 1,
      data: topicList
    });
  }

  // 获取话题详情
  async getTopicById(req, res) {
    const { tid } = req.params;
    const { id } = req.session.user;

    const data = await TopicProxy.getTopicDetail(tid, id);

    return res.send({
      status: 1,
      data
    });
  }

  // 喜欢或者取消喜欢话题
  async starOrUnStar(req, res) {
    const { tid } = req.params;
    const { id } = req.session.user;

    const topic = await this.getTopicById(tid);
    const author = await UserProxy.getUserById(topic.author_id);

    if (topic.author_id.equals(id)) {
      return res.send({
        status: 0,
        message: '不能喜欢自己的话题哟'
      });
    }

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

    return res.send({
      status: 1,
      data: action.toObject({ virtuals: true }).actualType
    });
  }

  // 收藏或者取消收藏话题
  async collectOrUnCollect(req, res) {
    const { tid } = req.params;
    const { id } = req.session.user;

    const topic = await this.getTopicById(tid);
    const author = await UserProxy.getUserById(topic.author_id);

    if (topic.author_id.equals(id)) {
      return res.send({
        status: 0,
        message: '不能收藏自己的话题哟'
      });
    }

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

    return res.send({
      status: 1,
      data: action.toObject({ virtuals: true }).actualType
    });
  }
}

module.exports = new Topic();
