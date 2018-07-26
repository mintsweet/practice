const ActionModel = require('../models/action');

module.exports = class Behavior {
  /**
   * 创建一个行为
   *
   * @static
   * @param {String} type
   * @param {ObjectId} author_id
   * @param {ObjectId} target_id
   * @returns
   */
  static createBehavior(type, author_id, target_id) {
    return ActionModel.create({ type, author_id, target_id });
  }

  /**
   * 行为取反
   *
   * @static
   * @param {String} type
   * @param {ObjectId} author_id
   * @param {ObjectId} target_id
   */
  static async negateBehavior(type, author_id, target_id) {
    const behavior = await ActionModel.findOne({ type, author_id, target_id });
    behavior.is_un = !behavior.is_un;
    await behavior.save();
  }

  /**
   * 生成一个行为
   *
   * @static
   * @param {*} type
   * @param {*} author_id
   * @param {*} target_id
   */
  static async setAction(type, author_id, target_id) {
    const action = await ActionModel.findOne({ type, author_id, target_id });
    if (action) {
      await this.negateBehavior(type, author_id, target_id);
    } else {
      await this.createBehavior(type, author_id, target_id);
    }
  }
};
