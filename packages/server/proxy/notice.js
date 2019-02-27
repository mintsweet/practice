const NoticeModel = require('../models/notice');

module.exports = class Notice {
  /**
   * 创建提醒
   *
   * @static
   * @param {Object} notice
   * @returns
   */
  static async create(notice) {
    const temp = await NoticeModel.findOne(notice);

    if (temp) {
      return NoticeModel.updateOne(notice, { update_at: new Date() });
    }

    return NoticeModel.create(notice);
  }

  /**
   * 删除提醒
   *
   * @param {Object} conditions
   * @returns
   */
  static delete(conditions) {
    return NoticeModel.deleteMany(conditions);
  }

  /**
   * 查询提醒
   *
   * @param {Object} query
   * @param {Object} select
   * @param {Object} options
   * @returns
   */
  static get(query, select, options) {
    return NoticeModel.find(query, select, options);
  }
};
