const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  mobile: { unqie: true, type: String, required: true },
  password: { type: String, required: true },
  
  nickname: { unqie: true, type: String, required: true },
  avatar: { type: String, default: '' },
  location: { type: String, default: '' },
  signature: { type: String, default: '' },

  score: { type: Number, default: 0 },
  
  is_star: { type: Boolean, default: false },
  is_admin: { type: Boolean, default: false },
  is_block: { type: Boolean, default: false },

  topic_count: { type: Number, default: 0 },
  like_count: { type: Number, default: 0 },
  collect_count: { type: Number, default: 0 },
  reply_count: { type: Number, default: 0 },
  follower_count: { type: Number, default: 0 },
  following_count: { type: Number, default: 0 },

  role: { type: Number, default: 0 },

  create_at: { type: Date, default: Date.now },
  update_at: { type: Date, default: Date.now },
});

UserSchema.virtual('isAdvanced').get(function() {
  return this.score > 1000 || this.is_start;
});

UserSchema.index({ mobile: 1 }, { unique: true });
UserSchema.index({ score: -1 });

UserSchema.pre('save', function(next) {
  this.update_at = new Date();
  next();
});

const User = mongoose.model('User', UserSchema);

module.exports = User;