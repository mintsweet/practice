const TopicModel = require('../models/topic');
const UserModel = require('../models/user');
const BehaviorModel = require('../models/behavior');

module.exports = class Topic {
  static getTopicById(id, option) {
    return TopicModel.findById(id, option);
  }

  static async createTopic(obj, uid) {
    const topic = await TopicModel.create(obj);
    const author = await UserModel.findById(uid);
    await BehaviorModel.create({ type: 'create', author_id: uid, target_id: topic.id });
    author.score += 1;
    author.topic_count += 1;
    await author.save();
  }
}