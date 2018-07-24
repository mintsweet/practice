const bcrypt = require('bcryptjs');
const Base = require('./base');
const UserProxy = require('../../proxy/user');

const SALT_WORK_FACTOR = 10;

class User extends Base {
  constructor() {
    super();
    this.signup = this.signup.bind(this);
  }

  // 注册
  async signup(ctx) {
    const { mobile, password, nickname, smscaptcha } = ctx.request.body;
    const sms_code = ctx.state.sms_code || {};

    try {
      if (!mobile || !/^1[3,5,7,8,9]\w{9}$/.test(mobile)) {
        throw new Error('请输入正确的手机号');
      } else if (!password || !/(?!^(\d+|[a-zA-Z]+|[~!@#$%^&*?]+)$)^[\w~!@#$%^&*?].{6,18}/.test(password)) {
        throw new Error('密码必须为数字、字母和特殊字符其中两种组成并且在6-18位之间');
      } else if (!nickname || nickname.length > 8 || nickname.length < 2) {
        throw new Error('请输入2-8位的昵称');
      } else if (sms_code.mobile !== mobile) {
        throw new Error('收取验证码的手机与登录手机不匹配');
      } else if (sms_code.code !== smscaptcha) {
        throw new Error('短信验证码不正确');
      } else if (Date.now() > sms_code.expired) {
        throw new Error('短信验证码已经失效了，请重新获取');
      }
    } catch(err) {
      ctx.throw(400, err.message);
    }

    let existUser;

    existUser = await UserProxy.getUserByMobile(mobile);
    if (existUser) {
      ctx.throw(400, '手机号已经注册过了');
    }

    existUser = await UserProxy.getUserByNickName(nickname);
    if (existUser) {
      ctx.throw(400, '昵称已经注册过了');
    }

    const bcryptPassword = await this.encryption(password);
    await UserProxy.create(nickname, mobile, bcryptPassword);
  }

  async encryption(password) {
    const salt = await bcrypt.genSalt(SALT_WORK_FACTOR);
    const hash = await bcrypt.hash(password, salt);
    return hash;
  }
}

module.exports = new User();
