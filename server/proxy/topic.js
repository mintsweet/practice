const TopicModel = require('../models/topic');
const UserProxy = require('./user');
const ActionProxy = require('./action');
const ReplyProxy = require('./reply');

module.exports = class Topic {
  /**
   * 根据ID查找话题
   *
   * @static
   * @param {*} id
   * @param {*} option
   */
  static async getTopicById(id, select = null, option) {
    const topic = await TopicModel.findById(id, select, option);
    return topic.toObject({ virtuals: true });
  }

  /**
   * 根据条件查找话题
   *
   * @static
   * @param {Object} query
   * @param {String} option
   * @returns
   */
  static async getTopicsByQuery(query, select = null, option) {
    const topics = await TopicModel.find(query, select, option);
    return topics;
  }

  /**
   * 创建一篇话题
   *
   * @static
   * @param {Object} params
   */
  static async createTopic(params) {
    const topic = await TopicModel.create(params);
    const author = await UserProxy.getUserById(topic.author_id);

    // 积分累计
    const score = author.score + 1;
    // 话题数量累计
    const topic_count = author.topic_count + 1;
    // 更新用户信息
    await UserProxy.updateUser(author.id, { score, topic_count });
    // 创建行为
    await ActionProxy.setAction('create', author.id, topic.id);
  }

  /**
   * 删除一篇话题
   *
   * @static
   * @param {ObjectId} tid
   */
  static async deleteTopic(tid) {
    const topic = await this.getTopicById(tid);
    const author = await UserProxy.getUserById(topic.author_id);
    // 改变为删除状态
    topic.delete = true;
    await topic.save();

    // 积分减去
    const score = author.score - 1;
    // 话题数量减少
    const topic_count = author.topic_count - 1;
    // 更新用户信息
    await UserProxy.updateUser(author.id, { score, topic_count });
    // 取反行为
    await ActionProxy.negateAction('create', author.id, topic.id);
  }

  /**
   * 编辑一篇话题
   *
   * @static
   * @param {Object} params
   */
  static async updateTopic(params) {
    const topic = await TopicModel.findById(params.tid);

    // 更新内容
    topic.tab = params.tab || topic.tab;
    topic.title = params.title || topic.title;
    topic.content = params.content || topic.content;
    await topic.save();
  }

  /**
   * 根据条件统计话题数量
   *
   * @static
   * @param {Object} query
   * @returns
   */
  static async countTopic(query) {
    const count = TopicModel.count(query);
    return count;
  }

  /**
   * 获取话题列表
   *
   * @static
   * @param {*} query
   * @param {*} [select=null]
   * @param {*} option
   */
  static async getTopicList(query, select = null, option) {
    const topics = this.getTopicsByQuery(query, select, option);
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

    const result = topics.map((item, i) => {
      return {
        ...item.toObject({ virtuals: true }),
        author: promiseAuthor[i],
        last_reply_author: promiseLastReply[i],
        last_reply_at_ago: item.last_reply_at_ago()
      };
    });

    return result;
  }

  /**
   * 获取话题详情
   *
   * @static
   * @param {ObjectId} tid
   * @param {ObjectId} uid
   * @returns
   */
  static async getTopicDetail(tid, uid) {
    const topic = this.getTopicById(tid);

    // 访问计数
    topic.visit_count += 1;
    await topic.save();

    // 作者
    const author = await UserProxy.findById(topic.author_id, 'id nickname avatar location signature score');
    // 回复
    let replies = await ReplyProxy.getReplyByQuery({ topic_id: topic.id });
    const reuslt = await Promise.all(replies.map(item => {
      return new Promise(resolve => {
        resolve(UserProxy.findById(item.author_id, 'id nickname avatar'));
      });
    }));

    replies = replies.map((item, i) => ({
      ...item.toObject({ virtuals: true }),
      author: reuslt[i],
      create_at_ago: item.create_at_ago()
    }));

    // 状态
    let like;
    let collect;

    if (uid) {
      like = await ActionProxy.getAction({ action: 'like', author_id: uid, target_id: topic.id });
      collect = await ActionProxy.findOne({ action: 'collect', author_id: uid, target_id: topic.id });
    }

    like = (like && !like.is_un) || false;
    collect = (collect && !collect.is_un) || false;

    return {
      topic,
      author,
      replies,
      like,
      collect
    };
  }

  /**
   * 更新最后一次回复
   *
   * @static
   * @param {ObjectId} tid
   * @param {ObjectId} reply_id
   */
  static async updateTopicLastReply(tid, reply_id) {
    const topic = await this.getTopicById(tid);
    topic.last_reply = reply_id;
    topic.last_reply_at = new Date();
    topic.reply_count += 1;
    await topic.save();
  }
};
