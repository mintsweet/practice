const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const moment = require('moment');
const UserData = require('../mock/user');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  id: { unqie: true, type: Number, isRequire: true },
  mobile: { unqie: true, type: String, isRequire: true },
  nickname: { unqie: true, type: String, isRequire: true },
  password: { type: String, isRequire: true },
});

UserSchema.index({ id: 1 });

const User = mongoose.model('User', UserSchema);

module.exports = User;