import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import moment from 'moment';
import AdminData from '../mock/admin';

const Schema = mongoose.Schema;

const AdminSchema = new Schema({
  id: {
    unqie: true,
    type: Number,
    isRequire: true
  },
  nickname: {
    unqie: true,
    type: String,
    isRequire: true
  },
  username: {
    unqie: true,
    type: String,
    isRequire: true
  },
  password: {
    type: String,
    isRequire: true
  },
  mobile: {
    unqie: true,
    type: String,
    isRequire: true
  },
  avatar: {
    type: String,
    isRequire: true,
    default: 'http://image.yujunren.com/react-demo/avatar.jpg'
  },
  role: {
    type: String,
    isRequire: true,
    default: 1
  },
  status: {
    type: String,
    isRequire: true,
    default: 'audit'
  },
  reasion: {
    type: String
  },
  create_at: {
    type: String,
    default: moment(Date.now()).format('YYYY-MM-DD HH:mm')
  }
});

AdminSchema.index({ id: 1 });

const Admin = mongoose.model('Admin', AdminSchema);

Admin.findOne((err, data) => {
  if (!data) {
    AdminData.map(async item => {
      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(item.password, salt);
      const _admin = new Admin({
        id: item.id,
        nickname: item.nickname,
        username: item.username,
        password: hash,
        mobile: item.mobile,
        role: item.role,
        status: item.status
      });
      await _admin.save();
    });
  }
});

export default Admin;