const mongoose = require('mongoose');

const { Schema } = mongoose;
const { ObjectId } = Schema;

const TopicSchema = new Schema(
  {
    // 话题信息
    tab: { type: String }, // 类型
    title: { type: String, required: true }, // 标题
    content: { type: String, required: true }, // 内容
    aid: { type: ObjectId, required: true }, // 作者ID

    // 话题类型
    is_top: { type: Boolean, default: false }, // 置顶
    is_good: { type: Boolean, default: false }, // 精华
    is_lock: { type: Boolean, default: false }, // 封贴 - 管理员行为
    is_delete: { type: Boolean, default: false }, // 删除话题 - 用户行为

    // 统计
    like_count: { type: Number, default: 0 }, // 喜欢数量
    collect_count: { type: Number, default: 0 }, // 收藏数量
    reply_count: { type: Number, default: 0 }, // 回复数量
    visit_count: { type: Number, default: 0 }, // 访问数量

    // 最后一次回复 - 排序展示
    last_reply_id: { type: ObjectId }, // 最后一次回复ID
    last_reply_at: { type: Date }, // 最后一次回复时间
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  },
);

TopicSchema.index({ top: -1 });
TopicSchema.index({ good: -1 });
TopicSchema.index({ last_reply_at: -1 });

module.exports = mongoose.model('topic', TopicSchema, 'topic');
