const mongoose = require('mongoose');
const { Schema } = mongoose;
const BaseModel = require('./base');

const UserSchema = new Schema({
  // 登录信息
  mobile: { unqie: true, type: Number, required: true },
  password: { type: String, required: true },

  // 用户信息
  nickname: { unqie: true, type: String, required: true },
  avatar: { type: String, default: 'http://image.yujunren.com/avatar.jpg' },
  location: { type: String, default: '' },
  signature: { type: String, default: '' },

  // 积分
  score: { type: Number, default: 0 },

  // 星标用户 - 预留
  star: { type: Boolean, default: false },
  // 封号 - 管理员行为
  lock: { type: Boolean, default: false },

  // 统计
  topic_count: { type: Number, default: 0 }, // 累计发布话题数
  star_count: { type: Number, default: 0 }, // 累计话题被喜欢数
  collect_count: { type: Number, default: 0 }, // 累计话题被收藏数
  reply_count: { type: Number, default: 0 }, // 累计回复数
  follower_count: { type: Number, default: 0 }, // 累计粉丝数
  following_count: { type: Number, default: 0 }, // 累计关注数

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
  return this.score > 1000 || this.star;
});

UserSchema.pre('save', function(next) {
  this.update_at = new Date();
  next();
});

const User = mongoose.model('User', UserSchema);

// insert root data
const userData = require('./data/root');
const bcrypt = require('bcryptjs');
if (process.env.NODE_ENV !== 'test') {
  User.findOne((err, data) => {
    if (err) {
      console.error(err);
    }
    if (!data) {
      User.create({
        ...userData,
        password: bcrypt.hashSync(userData.password, bcrypt.genSaltSync(10))
      });
    }
  });
}

module.exports = User;
