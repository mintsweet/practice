const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const moment = require('moment');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  id: { unqie: true, type: Number, isRequire: true },

  mobile: { unqie: true, type: String },
  password: { type: String, isRequire: true },
  
  nickname: { unqie: true, type: String, isRequire: true },
  avatar: { type: String },
  location: { type: String },
  signature: { type: String },

  score: { type: Number, default: 0 },
  topic_count: { type: Number, default: 0 },
  reply_count: { type: Number, default: 0 },
  follower_count: { type: Number, default: 0 },
  following_count: { type: Number, default: 0 },

  create_at: { type: Date, default: Date.now },
  update_at: { type: Date, default: Date.now },
});

UserSchema.index({ id: 1 });

const User = mongoose.model('User', UserSchema);

module.exports = User;