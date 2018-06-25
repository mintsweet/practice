const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

/*
* 根据类型区分消息 type
* 1. create 创建
* 2. like 喜欢
* 3. collect 收藏
* 4. reply 回复话题
* 5. reply2 回复评论
* 6. follow 关注
*/

const NoticeSchema = new Schema({
  type: { type: String, required: true },

  master_id: { type: ObjectId, required: true },
  author_id: { type: ObjectId, required: true },

  has_read: { type: Boolean, default: false },

  is_system: { type: Boolean, default: false },

  create_at: { type: Date, default: Date.now }
});

NoticeSchema.index({ create_at: -1 });

const Notice = mongoose.model('Notice', NoticeSchema);

module.exports = Notice;