const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TopicSchema = new Schema({
  id: { unqie: true, type: Number, isRequire: true },
  title: { type: String, isRequire: true },
  content: { type: String, isRequire: true },
  author_id: { type: Number, isRequire: true },
  top: { type: Boolean, default: false }, // 置顶
  good: { type: Boolean, default: false }, // 精华
  lock: { type: Boolean, default: false }, // 锁定
  reply_count: { type: Number, default: 0 },
  visit_count: { type: Number, default: 0 },
  collect_count: { type: Number, default: 0 },
  create_at: { type: Date, default: Date.now },
  update_at: { type: Date, default: Date.now },
  last_reply: { type: Number },
  last_reply_at: { type: Date, default: Date.now },
  tab: { type: String },
  deleted: { type: Boolean, default: false },
});

TopicSchema.index({ create_at: -1 });
TopicSchema.index({ top: -1, last_reply_at: -1 });
TopicSchema.index({ author_id: 1, create_at: -1 });

const Topic = mongoose.model('Topic', PostSchema);

module.exports = Topic;