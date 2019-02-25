const mongoose = require('mongoose');
const Plugin = require('./plugin');
const config = require('../config');

const { Schema } = mongoose;
const { ObjectId } = Schema;

const TopicSchema = new Schema({
  // 话题信息
  title: { type: String, required: true },
  content: { type: String, required: true },
  author_id: { type: ObjectId, required: true },

  // 话题类型
  top: { type: Boolean, default: false }, // 置顶
  good: { type: Boolean, default: false }, // 精华

  // 封贴 - 管理员行为
  lock: { type: Boolean, default: false },

  // 统计
  like_count: { type: Number, default: 0 },
  collect_count: { type: Number, default: 0 },
  reply_count: { type: Number, default: 0 },
  visit_count: { type: Number, default: 0 },

  // 最后一次回复 - 排序展示
  last_reply: { type: ObjectId },
  last_reply_at: { type: Date, default: Date.now },

  // 类型
  tab: { type: String },

  create_at: { type: Date, default: Date.now },
  update_at: { type: Date, default: Date.now },

  // 删除话题 - 用户行为
  delete: { type: Boolean, default: false }
});

TopicSchema.virtual('tabName').get(function() {
  const current = config.tabs.find(item => item.tag === this.tab);
  return current.name;
});

TopicSchema.plugin(Plugin);

TopicSchema.index({ create_at: -1 });
TopicSchema.index({ top: -1, last_reply_at: -1 });
TopicSchema.index({ author_id: 1, create_at: -1 });

const Topic = mongoose.model('Topic', TopicSchema);

module.exports = Topic;
