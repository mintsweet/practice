const mongoose = require('mongoose');

const { Schema } = mongoose;
const { ObjectId } = Schema;

/*
 * 根据类型区分行为 type
 * 1. create 创建了
 * 2. star 喜欢了
 * 3. collect 收藏了
 * 4. follow 关注了
 * 5. up 点赞了
 */

const ActionSchema = new Schema(
  {
    type: { type: String, required: true }, // 类型
    aid: { type: ObjectId, required: true }, // 发起者
    tid: { type: ObjectId, required: true }, // 命中者
    is_un: { type: Boolean, default: true }, // 若为 false 行为反向
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  },
);

ActionSchema.index({ type: 1, aid: 1, tid: 1 }, { unique: true });

module.exports = mongoose.model('action', ActionSchema, 'action');
