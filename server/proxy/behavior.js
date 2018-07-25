const BehaviorModel = require('../models/behavior');

module.exports = class Behavior {
  /**
   * 创建一个行为
   *
   * @static
   * @param {String} action
   * @param {ObjectId} author_id
   * @param {ObjectId} target_id
   * @returns
   */
  static createBehavior(action, author_id, target_id) {
    return BehaviorModel.create({ action, author_id, target_id});
  }

  /**
   * 行为取反
   *
   * @static
   * @param {String} action
   * @param {ObjectId} author_id
   * @param {ObjectId} target_id
   */
  static async negateBehavior(action, author_id, target_id) {
    const behavior = await BehaviorModel.findOne({ action, author_id, target_id });
    behavior.is_un = !behavior.is_un;
    await behavior.save();
  }
};
