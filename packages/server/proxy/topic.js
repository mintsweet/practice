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
   * @parma {ObjectId} id
   */
  static async deleteById(id) {
    return TopicModel.deleteOne({ _id: id });
  }
};
