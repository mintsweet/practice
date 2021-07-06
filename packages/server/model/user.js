const mongoose = require('mongoose');
const { Schema } = mongoose;

const UserSchema = new Schema(
  {
    // 登录信息
    email: { type: String, required: true, unique: true },
    password: { type: String, require: true },

    // 用户信息
    nickname: { type: String, required: true },
    avatar: { type: String, default: 'avatar.jpeg' },
    location: { type: String, default: '' },
    signature: { type: String, default: '' },

    // 积分
    score: { type: Number, default: 0 },

    // 星标用户 - 预留
    is_star: { type: Boolean, default: false },
    // 封号 - 管理员行为
    is_lock: { type: Boolean, default: false },
    // 注销账户 - 用户主动行为
    is_delete: { type: Boolean, default: false },

    // 统计
    topic_count: { type: Number, default: 0 }, // 累计发布话题数
    like_count: { type: Number, default: 0 }, // 累计话题被喜欢数
    collect_count: { type: Number, default: 0 }, // 累计话题被收藏数
    follower_count: { type: Number, default: 0 }, // 累计粉丝数
    following_count: { type: Number, default: 0 }, // 累计关注数

    // 管理员等级
    role: { type: Number, default: 0 },
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  },
);

module.exports = mongoose.model('user', UserSchema, 'user');
