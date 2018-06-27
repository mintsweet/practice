const mongoose = require('mongoose');
const config = require('../../config.default');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const TopicSchema = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  author_id: { type: ObjectId, required: true },
  
  top: { type: Boolean, default: false }, // 置顶
  good: { type: Boolean, default: false }, // 精华
  lock: { type: Boolean, default: false }, // 锁定

  like_count: { type: Number, default: 0 },
  collect_count: { type: Number, default: 0 },
  reply_count: { type: Number, default: 0 },
  visit_count: { type: Number, default: 0 },

  create_at: { type: Date, default: Date.now },
  update_at: { type: Date, default: Date.now },

  last_reply: { type: ObjectId },
  last_reply_at: { type: Date, default: Date.now },
  
  tab: { type: String },

  delete: { type: Boolean, default: false }
});

TopicSchema.index({ create_at: -1 });
TopicSchema.index({ top: -1, last_reply_at: -1 });
TopicSchema.index({ author_id: 1, create_at: -1 });

TopicSchema.virtual('tabName').get(function() {
  const pair = config.tabs.find(item => item.url === this.tab);
  return pair ? pair.name : ''; 
});

const Topic = mongoose.model('Topic', TopicSchema);

module.exports = Topic;