const TopicModel = require('../models/topic');

const UserProxy = require('./user');
const BehaviorProxy = require('./behavior');

module.exports = class Topic {
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
    await BehaviorProxy.setAction('create', author.id, topic.id);
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
    await BehaviorProxy.negateBehavior('create', author.id, topic.id);
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

  static async getTopicsByQuery(query, option) {
    const topics = await TopicModel.find(query, option);
    return topics;
  }
};
