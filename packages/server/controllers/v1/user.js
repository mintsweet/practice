const jwt = require('jsonwebtoken');
const uuid = require('uuid/v4');
const Base = require('../base');
const config = require('../../config');
const { redisProxy } = require('../../db');
const UserProxy = require('../../proxy/user');
const ActionProxy = require('../../proxy/action');
const TopicProxy = require('../../proxy/topic');
const NoticeProxy = require('../../proxy/notice');

class User extends Base {
  constructor() {
    super();
    this.signup = this.signup.bind(this);
    this.signin = this.signin.bind(this);
    this.forgetPass = this.forgetPass.bind(this);
    this.resetPass = this.resetPass.bind(this);
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

    // 随机的uuid
    const secret = uuid();
    const key = `${email}&${secret}`;

    // 加密
    const token = await this._md5(key);
    await redisProxy.set(email, token, 'EX', 60 * 30);

    const url = `/v1/set_active?token=${token}&email=${email}`;

    ctx.body = url;
  }

  // 账户激活
  async setActive(ctx) {
    const { email, token } = ctx.query;
    const secret = await redisProxy.get(email);

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
    await redisProxy.set(email, token, 'EX', 60 * 30);

    const url = `/v1/reset_pass?token=${token}&email=${email}`;

    ctx.body = url;
  }

  // 重置密码
  async resetPass (ctx) {
    const { email, token } = ctx.query;
    const { newPass } = ctx.request.body;

    const secret = await redisProxy.get(email);

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
    const user = await UserProxy.getById(id);
    ctx.body = user;
  }

  // 更新个人信息
  async updateSetting(ctx) {
    const { id } = ctx.state.user;
    const { nickname } = ctx.request.body;

    const user = await UserProxy.getOne({ nickname });
    if (user) {
      ctx.throw(409, '昵称已经注册过了');
    }

    await UserProxy.update({ id }, ctx.request.body);
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

  // 获取积分榜用户列表
  async getUserTop(ctx) {
    const { count = 10 } = ctx.query;
    const limit = parseInt(count);
    const users = await UserProxy.get({}, '', { limit, sort: '-score' });
    ctx.body = users;
  }

  // 根据ID获取用户信息
  async getUserById(ctx) {
    const { uid } = ctx.params;

    const user = await UserProxy.getById(uid);

    if (!user) {
      ctx.throw(404, '用户不存在');
    }

    ctx.body = user.toObject({ virtuals: true });
  }

  // 获取用户动态
  async getUserAction(ctx) {
    const { uid } = ctx.params;

    const actions = await ActionProxy.get({ author_id: uid, is_un: false });
    const result = await Promise.all(actions.map(item => {
      return new Promise(resolve => {
        if (item.type === 'follow') {
          resolve(UserProxy.getById(item.target_id, 'id nickname signature avatar'));
        } else {
          resolve(TopicProxy.getById(item.target_id, 'id title'));
        }
      });
    }));

    const data = actions.map((item, i) => {
      return {
        ...result[i].toObject({ virtuals: true }),
        type: item.type
      };
    });

    ctx.body = data;
  }

  // 获取用户专栏的列表
  async getUserCreate(ctx) {
    const { uid } = ctx.params;

    const actions = await ActionProxy.get({ type: 'create', author_id: uid, is_un: false });
    const data = await Promise.all(actions.map(item => {
      return new Promise(resolve => {
        resolve(TopicProxy.getById(item.target_id, 'id title like_count collect_count visit_count'));
      });
    }));

    ctx.body = data;
  }

  // 获取用户喜欢列表
  async getUserLike(ctx) {
    const { uid } = ctx.params;

    const actions = await ActionProxy.get({ type: 'like', author_id: uid, is_un: false });
    const data = await Promise.all(actions.map(item => {
      return new Promise(resolve => {
        resolve(TopicProxy.getById(item.target_id, 'id title'));
      });
    }));

    ctx.body = data.map(item => ({ ...item.toObject({ virtuals: true }), type: 'like' }));
  }

  // 获取用户收藏列表
  async getUserCollect(ctx) {
    const { uid } = ctx.params;

    const actions = await ActionProxy.get({ type: 'collect', author_id: uid, is_un: false });
    const data = await Promise.all(actions.map(item => {
      return new Promise(resolve => {
        resolve(TopicProxy.getById(item.target_id, 'id title'));
      });
    }));

    ctx.body = data.map(item => ({ ...item.toObject({ virtuals: true }), type: 'collect' }));
  }

  // 获取用户粉丝列表
  async getUserFollower(ctx) {
    const { uid } = ctx.params;

    const actions = await ActionProxy.get({ type: 'follow', target_id: uid, is_un: false });
    const data = await Promise.all(actions.map(item => {
      return new Promise(resolve => {
        resolve(UserProxy.getById(item.author_id, 'id nickname avatar'));
      });
    }));

    ctx.body = data;
  }

  // 获取用户关注的人列表
  async getUserFollowing(ctx) {
    const { uid } = ctx.params;

    const actions = await ActionProxy.get({ type: 'follow', author_id: uid, is_un: false });
    const data = await Promise.all(actions.map(item => {
      return new Promise(resolve => {
        resolve(UserProxy.getById(item.target_id, 'id nickname avatar'));
      });
    }));

    ctx.body = data;
  }

  // 关注或者取消关注某个用户
  async followOrUn(ctx) {
    const { uid } = ctx.params;
    const { id } = ctx.state.user;

    if (uid === id) {
      ctx.throw(403, '不能关注你自己');
    }

    const targetUser = await UserProxy.getById(uid);
    const authorUser = await UserProxy.getById(id);

    const actionParam = {
      type: 'follow',
      author_id: id,
      target_id: uid
    };

    let action;
    action = await ActionProxy.getOne(actionParam);

    if (action) {
      action.is_un = !action.is_un;
      await action.save();
    } else {
      action = await ActionProxy.create(actionParam);
    }

    if (action.is_un) {
      targetUser.follower_count -= 1;
      await targetUser.save();
      authorUser.following_count -= 1;
      await authorUser.save();
    } else {
      targetUser.follower_count += 1;
      await targetUser.save();
      authorUser.following_count += 1;
      await authorUser.save();
      await NoticeProxy.create({
        type: 'follow',
        author_id: id,
        target_id: uid
      });
    }

    ctx.body = action.toObject({ virtuals: true }).actualType;
  }
}

module.exports = new User();
