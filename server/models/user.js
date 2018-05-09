const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const moment = require('moment');
const UserData = require('../mock/user');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  id: {
    unqie: true,
    type: Number,
    isRequire: true
  },
  mobile: {
    unqie: true,
    type: String,
    isRequire: true
  },
  nickname: {
    unqie: true,
    type: String,
    isRequire: true
  },
  password: {
    type: String,
    isRequire: true
  },
  motto: {
    type: String
  },
  post_list: {
    type: Array,
    default: []
  },
  mood_list: {
    type: Array,
    default: []
  },
  collect_list: {
    type: Array,
    default: []
  },
  praise_list: {
    type: Array,
    default: []
  },
  dynamic: {
    type: Array,
    default: []
  },
  follow: {
    type: Array,
    default: []
  },
  fans: {
    type: Array,
    default: []
  },
  create_at: {
    type: String,
    default: moment(Date.now()).format('YYYY-MM-DD HH:mm')
  }
});

UserSchema.index({ id: 1 });

const User = mongoose.model('User', UserSchema);

User.findOne((err, data) => {
  if (!data) {
    UserData.map(async item => {
      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(item.password, salt);
      const _user = new User({
        id: item.id,
        mobile: item.mobile,
        nickname: item.nickname,
        password: hash,
        motto: item.motto
      });
      await _user.save();
    });
  }
});

module.exports = User;