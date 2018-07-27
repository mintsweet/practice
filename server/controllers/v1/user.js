const bcrypt = require('bcryptjs');
const UserProxy = require('../../proxy/user');
const { getRedis } = require('../../db');

const SALT_WORK_FACTOR = 10;

class User {
  constructor() {
    this.signup = this.signup.bind(this);
  }

  // 注册
  async signup(ctx) {
    const { mobile, password, nickname, smscaptcha } = ctx.request.body;
    const code = await getRedis(mobile);

    try {
      if (!mobile || !/^1[3,5,7,8,9]\d{9}$/.test(mobile)) {
        throw new Error('手机号格式不正确');
      } else if (!password || !/(?!^(\d+|[a-zA-Z]+|[~!@#$%^&*?]+)$)^[\w~!@#$%^&*?].{6,18}/.test(password)) {
        throw new Error('密码必须为数字、字母和特殊字符其中两种组成并且在6至18位之间');
      } else if (!nickname || nickname.length > 8 || nickname.length < 2) {
        throw new Error('昵称必须在2至8位之间');
      } else if (!code) {
        throw new Error('尚未获取短信验证码或者已经失效');
      } else if (code !== smscaptcha) {
        throw new Error('短信验证码不正确');
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
    await UserProxy.createUser(mobile, bcryptPassword, nickname);

    ctx.body = '';
  }

  // 密码加密
  async encryption(password) {
    const salt = await bcrypt.genSalt(SALT_WORK_FACTOR);
    const hash = await bcrypt.hash(password, salt);
    return hash;
  }
}

module.exports = new User();
