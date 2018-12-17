const TopicModel = require('../models/topic');

module.exports = class Topic {
  /**
   * 创建一篇话题
   *
   * @static
   * @param {Object} params
   */
  static async create(tab, title, content, author_id) {
    return TopicModel.create({ tab, title, content, author_id });
  }

  /**
   * 删除一篇话题
   *
   * @static
   * @param {Object} conditions
   */
  static async deleteOne(conditions) {
    return TopicModel.deleteOne(conditions);
  }

  /**
   * 查询一篇话题
   *
   * @static
   * @param {ObjectId} id
   */
  static async getById(id) {
    return TopicModel.findById(id);
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
