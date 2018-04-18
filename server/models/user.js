import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import moment from 'moment';
import userData from '../mock/userData';

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
  }
});

UserSchema.index({ id: 1 });

const User = mongoose.model('User', UserSchema);

User.findOne((err, data) => {
  if (!data) {
    userData.map(async item => {
      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(item.password, salt);
      const _user = new User({
        id: item.id,
        mobile: item.mobile,
        nickname: item.nickname,
        password: hash,
        motto: item.motto,
        post_list: item.post_list,
        mood_list: item.mood_list,
        collect_list: item.collect_list,
        praise_list: item.praise_list,
        dynamic: item.dynamic,
        follow: item.follow,
        fans: item.fans
      });
      await _user.save();
    });
  }
});

export default User;