const NoticeModel = require('../models/notice');

module.exports = class Notice {
  /**
   * 创建提醒
   *
   * @static
   * @param {Object} notice
   * @returns
   */
  static create(notice) {
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
};
