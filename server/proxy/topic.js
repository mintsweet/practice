const TopicModel = require('../models/topic');
const UserProxy = require('./user');
const ActionProxy = require('./action');

module.exports = class Topic {
  /**
   * 根据ID查找话题
   *
   * @static
   * @param {ObjectId} id
   * @param {String} select
   * @param {Object} option
   */
  static getTopicById(id, select, option) {
    return TopicModel.findById(id, select, option);
  }

  /**
   * 根据条件查找话题
   *
   * @static
   * @param {Object} query
   * @param {String} select
   * @param {Object} option
   * @returns
   */
  static getTopicsByQuery(query, select, option) {
    return TopicModel.find(query, select, option);
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
    author.score += 1;
    // 话题数量累计
    author.topic_count += 1;
    // 更新用户信息
    await author.save();
    // 创建行为
    await ActionProxy.createAction('create', author.id, topic.id);
  }

  /**
   * 根据条件统计话题数量
   *
   * @static
   * @param {Object} query
   * @returns
   */
  static countTopic(query) {
    return TopicModel.countDocuments(query);
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
