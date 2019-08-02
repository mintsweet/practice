const jwt = require('jsonwebtoken');
const uuid = require('uuid/v4');
const rq = require('request-promise');
const Base = require('./base');
const { jwt: { SECRET, EXPIRSE, REFRESH }, qn: { DONAME } } = require('../../../config');
const redis = require('../db/redis');
const UserProxy = require('../proxy/user');

const ENV = process.env.NODE_ENV;

class User extends Base {
  constructor() {
    super();
    this.signup = this.signup.bind(this);
    this.signin = this.signin.bind(this);
    this.forgetPass = this.forgetPass.bind(this);
    this.resetPass = this.resetPass.bind(this);
    this.updatePass = this.updatePass.bind(this);
    this.uploadAvatar = this.uploadAvatar.bind(this);
  }

  // GitHub 登录
  async github(ctx) {
    const { accessToken } = ctx.request.body;
    let profile;

    try {
      const res = await rq({
        url: 'https://api.github.com/user',
        method: 'GET',
        headers: {
          Authorization: `token ${accessToken}`,
          'user-agent': 'node.js',
        }
      });

      profile = JSON.parse(res);
    } catch(err) {
      ctx.throw(403, 'GitHub 授权失败');
    }

    if (!profile.email) {
      ctx.throw(401, 'GitHub 授权失败');
    }

    const existUser = await UserProxy.getOne({ email: profile.email });

    if (existUser) {
      existUser.avatar = profile.avatar_url;
      existUser.location = profile.location;
      existUser.signature = profile.bio;
      existUser.github_id = profile.id;
      existUser.github_username = profile.name;
      existUser.github_access_token = accessToken;

      await existUser.save();
    } else {
      await UserProxy.create({
        email: profile.email,
        nickname: profile.name,
        avatar: profile.avatar_url,
        location: profile.location,
        signature: profile.bio,
        github_id: profile.id,
        github_username: profile.name,
        github_access_token: accessToken,
      });
    }

    const user = await UserProxy.getOne({ github_id: profile.id });

    const token = jwt.sign(
      {
        id: user.id,
        role: user.role,
        exp: Date.now() + EXPIRSE,
        ref: Date.now() + REFRESH,
      },
      SECRET
    );

    ctx.body = `Bearer ${token}`;
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

    existUser = await UserProxy.getOne({ email });
    if (existUser) {
      ctx.throw(409, '邮箱已经注册过了');
    }

    existUser = await UserProxy.getOne({ nickname });
    if (existUser) {
      ctx.throw(409, '昵称已经注册过了');
    }

    const bcryptPassword = await this._encryption(password);
    await UserProxy.create({
      email,
      password: bcryptPassword,
      nickname
    });

    // 加密
    const token = await this._md5(`${email}&${uuid()}`);
    await redis.set(email, token, 'EX', 60 * 30);

    const url = `/set_active?token=${token}&email=${email}`;

    if (ENV !== 'production') ctx.body = url;

    await this._sendMail(email, url);
    ctx.body = '';
  }

  // 账户激活
  async setActive(ctx) {
    const { email, token } = ctx.query;
    const secret = await redis.get(email);

    if (secret !== token) {
      ctx.throw(400, '链接未通过校验');
    }

    await UserProxy.update({ email }, { active: true });

    ctx.body = '';
  }

  // 登录
  async signin(ctx) {
    const { email, password } = ctx.request.body;

    // 校验邮箱
    if (!email || !/^([A-Za-z0-9_\-.])+@([A-Za-z0-9_\-.])+\.([A-Za-z]{2,4})$/.test(email)) {
      ctx.throw(400, '邮箱格式错误');
    }

    const user = await UserProxy.getOne({ email });

    // 判断用户是否存在
    if (!user) {
      ctx.throw(404, '尚未注册');
    }

    if (!user.active) {
      ctx.throw(401, '邮箱账户尚未激活');
    }

    const isMatch = await this._comparePass(password, user.password);

    if (!isMatch) {
      ctx.throw(400, '密码错误');
    }

    // 返回JWT
    const token = jwt.sign(
      {
        id: user.id,
        role: user.role,
        exp: Date.now() + EXPIRSE,
        ref: Date.now() + REFRESH,
      },
      SECRET
    );

    ctx.body = `Bearer ${token}`;
  }

  // 忘记密码
  async forgetPass (ctx) {
    const { email } = ctx.request.body;

    // 校验邮箱
    if (!email || !/^([A-Za-z0-9_\-.])+@([A-Za-z0-9_\-.])+\.([A-Za-z]{2,4})$/.test(email)) {
      ctx.throw(400, '邮箱格式错误');
    }

    const user = await UserProxy.getOne({ email });

    // 判断用户是否存在
    if (!user) {
      ctx.throw(404, '尚未注册');
    }

    // 随机的uuid
    const secret = uuid();
    const key = `${user.email}&${secret}`;

    // 加密
    const token = await this._md5(key);
    await redis.set(email, token, 'EX', 60 * 30);

    const url = `/reset_pass?token=${token}&email=${email}`;

    if (ENV !== 'production') ctx.body = url;

    await this._sendMail(email, url);
    ctx.body = '';
  }

  // 重置密码
  async resetPass (ctx) {
    const { email, token } = ctx.query;
    const { newPass } = ctx.request.body;

    const secret = await redis.get(email);

    if (secret !== token) {
      ctx.throw(400, '链接未通过校验');
    }

    if (!newPass || !/(?!^(\d+|[a-zA-Z]+|[~!@#$%^&*?]+)$)^[\w~!@#$%^&*?].{6,18}/.test(newPass)) {
      ctx.throw(400, '新密码必须为数字、字母和特殊字符其中两种组成并且在6-18位之间');
    }

    const password = await this._encryption(newPass);
    await UserProxy.update({ email }, { password });

    ctx.body = '';
  }

  // 获取当前用户信息
  async getCurrentUser(ctx) {
    const { id } = ctx.state.user;
    const user = await UserProxy.getById(id, 'email nickname avatar location signature score');
    ctx.body = user;
  }

  // 更新个人信息
  async updateSetting(ctx) {
    const { id } = ctx.state.user;
    const { nickname } = ctx.request.body;

    const user = await UserProxy.getOne({ nickname });

    if (user && user.id !== id) {
      ctx.throw(409, '昵称已经注册过了');
    }

    await UserProxy.update({ _id: id }, ctx.request.body);
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

    const user = await UserProxy.getById(id);
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

  // 头像上传
  async uploadAvatar(ctx) {
    const { id } = ctx.state.user;
    const { avatar } = ctx.request.files;

    if (ENV !== 'production') ctx.body = '';

    try {
      const avatarName = await this._uploadImgByQn(`avatar_${id}.${avatar.path.split('.')[1]}`, avatar.path);
      ctx.body = `${DONAME}/${avatarName}`;
    } catch(err) {
      throw new Error(err);
    }
  }

  // 发送验证邮件
  sendMail(ctx) {
    ctx.body = '';
  }
}

module.exports = new User();
