const mongoose = require('mongoose');

const { Schema } = mongoose;
const { ObjectId } = Schema;

const ReplySchema = new Schema(
  {
    content: { type: String, required: true }, // 内容
    aid: { type: ObjectId, required: true }, // 回复人
    tid: { type: ObjectId, required: true }, // 回复话题
    up_count: { type: Number, default: 0 }, // 点赞数量
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  },
);

module.exports = mongoose.model('reply', ReplySchema, 'reply');
