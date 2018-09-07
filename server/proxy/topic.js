const TopicModel = require('../models/topic');

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
  static async createTopic(tab, title, content, author_id) {
    return TopicModel.create({ tab, title, content, author_id });
  }

  /**
   * 根据条件统计话题数量
   *
   * @static
   * @param {Object} query
   * @returns
   */
  static countTopicByQuery(query) {
    return TopicModel.countDocuments(query);
  }

  /**
   * 更新最后一次回复
   *
   * @static
   * @param {ObjectId} tid
   * @param {ObjectId} author_id
   */
  static async updateTopicLastReply(tid, author_id) {
    const topic = await this.getTopicById(tid);
    topic.last_reply = author_id;
    topic.last_reply_at = new Date();
    topic.reply_count += 1;
    await topic.save();
  }

  /**
   * 根据ID删除话题
   *
   * @static
   * @param {ObjectId} id
   * @returns
   */
  static async deleteTopicById(id) {
    return TopicModel.findByIdAndRemove(id);
  }

  /**
   * 根据ID更新话题
   *
   * @static
   * @param {ObjectId} id
   * @param {Object} update
   * @param {Object} option
   */
  static async updateTopicById(id, update, option) {
    return TopicModel.findByIdAndUpdate(id, update, option);
  }
};
