const mongoose = require('mongoose');
const { Schema } = mongoose;
const BaseModel = require('./base');

const UserSchema = new Schema({
  // 登录信息
  mobile: { unqie: true, type: String, required: true },
  password: { type: String, required: true },

  // 用户信息
  nickname: { unqie: true, type: String, required: true },
  avatar: { type: String, default: '' },
  location: { type: String, default: '' },
  signature: { type: String, default: '' },

  // 积分
  score: { type: Number, default: 0 },

  // 星标用户 - 预留
  is_star: { type: Boolean, default: false },
  // 封号 - 管理员行为
  is_lock: { type: Boolean, default: false },

  // 统计
  topic_count: { type: Number, default: 0 },
  star_count: { type: Number, default: 0 },
  collect_count: { type: Number, default: 0 },
  reply_count: { type: Number, default: 0 },
  follower_count: { type: Number, default: 0 },
  following_count: { type: Number, default: 0 },

  // 管理员等级
  role: { type: Number, default: 0 },

  create_at: { type: Date, default: Date.now },
  update_at: { type: Date, default: Date.now },

  // 注销账户 - 用户主动行为
  delete: { type: Boolean, default: false }
});

UserSchema.plugin(BaseModel);

UserSchema.index({ mobile: 1 }, { unique: true });
UserSchema.index({ score: -1 });

UserSchema.virtual('isAdvanced').get(function() {
  return this.score > 1000 || this.is_start;
});

UserSchema.virtual('isAdmin').get(function() {
  return this.role > 0;
});

UserSchema.virtual('isRoot').get(function() {
  return this.role > 100;
});

UserSchema.pre('save', function(next) {
  this.update_at = new Date();
  next();
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
