const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

/*
* 根据类型区分消息 type
* 0. system 系统
* 1. like 喜欢
* 2. collect 收藏
* 3. reply 回复话题
* 4. reply2 回复评论
* 5. follow 关注
*/

const NoticeSchema = new Schema({
  type: { type: String, required: true },

  target_id: { type: ObjectId, required: true },
  author_id: { type: ObjectId },
  topic_id: { type: ObjectId },
  reply_id: { type: ObjectId },

  has_read: { type: Boolean, default: false },

  create_at: { type: Date, default: Date.now }
});

NoticeSchema.index({ create_at: -1 });

const Notice = mongoose.model('Notice', NoticeSchema);

module.exports = Notice;