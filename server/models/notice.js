const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

/*
* 根据类型区分消息 type
* 1. create 创建
* 2. like 喜欢
* 2. collect 收藏
* 3. reply 回复
* 4. follow 关注
*/

const NoticeSchema = new Schema({
  type: { type: String, isRequire: true },

  master_id: { type: ObjectId, isRequire: true },
  author_id: { type: ObjectId, isRequire: true },

  has_read: { type: Boolean, default: false },

  create_at: { type: Date, default: Date.now }
});

NoticeSchema.index({ create_at: -1 });

const Notice = mongoose.model('Notice', NoticeSchema);

module.exports = Notice;
