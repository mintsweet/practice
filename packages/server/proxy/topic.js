const TopicModel = require('../models/topic');

module.exports = class Topic {
  /**
   * 创建话题
   *
   * @static
   * @param {Object} topic
   * @returns
   */
  static async create(topic) {
    return TopicModel.create(topic);
  }

  /**
   * 根据条件删除话题
   *
   * @static
   * @param {Object} conditions
   * @returns
   */
  static async delete(conditions) {
    return TopicModel.deleteMany(conditions);
  }

  /**
   * 更新话题
   *
   * @param {Object} conditions
   * @param {Object} doc
   * @param {Object} options
   * @returns
   */
  static update(conditions, doc, options) {
    return TopicModel.updateOne(conditions, doc, options);
  }

  /**
   * 根据ID查找话题
   *
   * @static
   * @param {ObjectId} id
   * @param {Object|String} select
   * @param {Object} options
   * @returns
   */
  static async getById(id, select, options) {
    return TopicModel.findById(id, select, options);
  }

  /**
   * 查询话题列表
   *
   * @static
   * @param {Object} query
   * @param {Object|String} select
   * @param {Object} options
   */
  static async get(query, select, options) {
    return TopicModel.find(query, select, options);
  }

  /**
   * 根据条件统计话题
   *
   * @static
   * @param {Object} filter
   */
  static async count(filter) {
    return TopicModel.countDocuments(filter);
  }
};
