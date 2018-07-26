const TopicModel = require('../models/topic');
const UserProxy = require('./user');
const ActionProxy = require('./action');

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
   * 根据条件查找话题(带作者和最后回复者)
   *
   * @static
   * @param {Object} query
   * @param {String} option
   * @returns
   */
  static async getTopicsByQuery(query, select = null, option) {
    const topics = await TopicModel.find(query, select, option);

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
};
