const mongoose = require('mongoose');

const { Schema } = mongoose;
const { ObjectId } = Schema;

/*
 * 根据类型区分消息 type
 * 1. system 系统
 * 2. like 喜欢话题
 * 3. collect 收藏话题
 * 4. follow 关注用户
 * 5. reply 回复话题
 * 6. up 点赞回复
 */

const NoticeSchema = new Schema(
  {
    type: { type: String, required: true }, // 类型
    uid: { type: ObjectId }, // 接收者
    aid: { type: ObjectId }, // 发送者
    tid: { type: ObjectId }, // 话题ID
    content: { type: String }, // 内容
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  },
);

module.exports = mongoose.model('notice', NoticeSchema, 'notice');
