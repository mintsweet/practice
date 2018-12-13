const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const UserProxy = require('../../proxy/user');
const config = require('../../config');

const SALT_WORK_FACTOR = 10;

class User {
  constructor() {
    this.signup = this.signup.bind(this);
  }

  // 注册
  async signup(ctx) {
    const { email, password, nickname } = ctx.request.body;

    try {
      if (!email || !/^([A-Za-z0-9_\-.])+@([A-Za-z0-9_\-.])+\.([A-Za-z]{2,4})$/.test(email)) {
        throw new Error('邮箱格式不正确');
      } else if (!password || !/(?!^(\d+|[a-zA-Z]+|[~!@#$%^&*?]+)$)^[\w~!@#$%^&*?].{6,18}/.test(password)) {
        throw new Error('密码必须为数字、字母和特殊字符其中两种组成并且在6至18位之间');
      } else if (!nickname || nickname.length > 6 || nickname.length < 2) {
        throw new Error('昵称必须在2至6位之间');
      }
    } catch(err) {
      ctx.throw(400, err.message);
    }

    let existUser;

    existUser = await UserProxy.getUserByQueryOne({ email });
    if (existUser) {
      ctx.throw(409, '邮箱已经注册过了');
    }

    existUser = await UserProxy.getUserByQueryOne({ nickname });
    if (existUser) {
      ctx.throw(409, '昵称已经注册过了');
    }

    const bcryptPassword = await this._encryption(password);
    await UserProxy.createUser(email, bcryptPassword, nickname);

    ctx.body = '';
  }

  // 密码加密
  async _encryption(password) {
    const salt = await bcrypt.genSalt(SALT_WORK_FACTOR);
    const hash = await bcrypt.hash(password, salt);
    return hash;
  }

  // 登录
  async signin(ctx) {
    const { email, password } = ctx.request.body;

    // 校验邮箱
    if (!email || !/^([A-Za-z0-9_\-.])+@([A-Za-z0-9_\-.])+\.([A-Za-z]{2,4})$/.test(email)) {
      ctx.throw(400, '邮箱格式错误');
    }

    const user = await UserProxy.getUserByQueryOne({ email });

    // 判断用户是否存在
    if (!user) {
      ctx.throw(404, '尚未注册');
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      ctx.throw(400, '密码错误');
    }

    // 返回JWT
    const token = jwt.sign(
      {
        id: user.id,
        role: user.role
      },
      config.secret,
      {
        expiresIn: '1h'
      }
    );

    ctx.body = `Bearer ${token}`;
  }

  // 当前用户信息
  async getUserInfo(ctx) {
    const { id } = ctx.state.user;
    const user = await UserProxy.getUserById(id);
    ctx.body = user;
  }
}

module.exports = new User();
