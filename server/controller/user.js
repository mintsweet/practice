import BaseComponent from '../proptype/BaseComponent';
import formidable from 'formidable';
import bcrypt from 'bcryptjs';
import UserModel from '../models/user';

const SALT_WORK_FACTOR = 10;

class User extends BaseComponent {
  constructor() {
    super();
    this.signup = this.signup.bind(this);
  }

  signup(req, res) {
    const form = new formidable.IncomingForm();
    form.parse(req, async (err, fields, files) => {
      if (err) {
        return res.send({
          status: 0,
          type: 'ERROR_PARMAS',
          message: '参数解析失败'
        });
      }

      const { nickname, mobile, password } = fields;
      const existUser = await UserModel.findOne({ mobile });
      if (existUser) {
        return res.send({
          status: 0,
          type: 'USER_HASN_EXIST',
          message: '手机号已经存在了'
        });
      }

      try {
        if (!mobile || !/^1[3,5,7,8,9]\d{9}$/.test(mobile)) {
          throw new Error('请输入正确的手机号!');
        } else if (!password || !/(?!^(\d+|[a-zA-Z]+|[~!@#$%^&*?]+)$)^[\w~!@#$%^&*?].{6,18}/.test(password)) {
          throw new Error('密码必须为数字、字母和特殊字符其中两种组成并且在6-18位之间!');
        } else if (!nickname || nickname.length > 8 || nickname.length < 4) {
          throw new Error('请输入4-8位的名称!');
        }
      } catch(err) {
        console.log(err);
        return res.send({
          status: 0,
          type: 'ERROR_SIGNUP_PARMAS',
          message: err.message
        });
      }

      const bcryptPassword = await this.encryption(password);
      const userId = await this.getId('user_id');
      const userInfo = {
        id: userId,
        nickname,
        password: bcryptPassword,
        mobile
      };

      try {
        await UserModel.create(userInfo);
        return res.send({
          status: 1,
          data: userInfo
        });
      } catch(err) {
        return res.send({
          status: 0,
          type: 'ERROR_SERVICE_FAILED',
          message: '服务器无响应，请稍后重试'
        });
      }
    });
  }

  async encryption(password) {
    const salt = await bcrypt.genSalt(SALT_WORK_FACTOR);
    const hash = await bcrypt.hash(password, salt);
    return hash;
  }

  signin() {

  }
}

export default new User();