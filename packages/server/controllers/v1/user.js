const jwt = require('jsonwebtoken');
const UserProxy = require('../../proxy/user');
const Base = require('./base');
const config = require('../../config');

class User extends Base {
  constructor() {
    super();
    this.signup = this.signup.bind(this);
    this.signin = this.signin.bind(this);
    this.updatePass = this.updatePass.bind(this);
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

    const isMatch = await this._comparePass(password, user.password);

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

  // 获取当前用户信息
  async getUserInfo(ctx) {
    const { id } = ctx.state.user;
    const user = await UserProxy.getUserById(id);
    ctx.body = user;
  }

  // 更新个人信息
  async updateSetting(ctx) {
    const { id } = ctx.state.user;
    const { nickname } = ctx.request.body;

    const user = await UserProxy.getUserByQueryOne({ nickname });
    if (user) {
      ctx.throw(409, '昵称已经注册过了');
    }

    await UserProxy.updateUserById(id, ctx.request.body);
    ctx.body = '';
  }

  // 修改密码
  async updatePass(ctx) {
    const { id } = ctx.state.user;
    const { oldPass, newPass } = ctx.request.body;

    try {
      if (!oldPass) {
        throw new Error('旧密码不能为空');
      } else if (!newPass || !/(?!^(\d+|[a-zA-Z]+|[~!@#$%^&*?]+)$)^[\w~!@#$%^&*?].{6,18}/.test(newPass)) {
        throw new Error('新密码必须为数字、字母和特殊字符其中两种组成并且在6-18位之间');
      }
    } catch(err) {
      ctx.throw(400, err.message);
    }

    const user = await UserProxy.getUserById(id);
    const isMatch = await this._comparePass(oldPass, user.password);

    if (isMatch) {
      const bcryptPassword = await this._encryption(newPass);
      // 更新用户密码
      user.password = bcryptPassword;
      await user.save();
      ctx.body = '';
    } else {
      ctx.throw(400, '旧密码错误');
    }
  }

  // 获取积分榜用户列表
  async getUserTop(ctx) {
    const { count = 10 } = ctx.query;
    const limit = parseInt(count);
    const users = await UserProxy.getUserByQuery({}, '', { limit, sort: '-score' });
    ctx.body = users;
  }
}

module.exports = new User();
