const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const UserProxy = require('../../proxy/user');
const ActionProxy = require('../../proxy/action');
const TopicProxy = require('../../proxy/topic');
const NoticeProxy = require('../../proxy/notice');
const { getRedis } = require('../../db');
const config = require('../../../config.default');

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
      ctx.throw(409, '手机号已经注册过了');
    }

    existUser = await UserProxy.getUserByNickname(nickname);
    if (existUser) {
      ctx.throw(409, '昵称已经注册过了');
    }

    const bcryptPassword = await this._encryption(password);
    await UserProxy.createUser(mobile, bcryptPassword, nickname);

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
    const { mobile, password, issms, smscaptcha } = ctx.request.body;

    // 校验手机号
    if (!mobile || !/^1[3,5,7,8,9]\d{9}$/.test(mobile)) {
      ctx.throw(400, '手机号格式错误');
    }

    const user = await UserProxy.getUserByMobile(mobile);

    // 判断用户是否存在
    if (!user) {
      ctx.throw(410, '尚未注册');
    }

    if (issms) {
      const code = await getRedis(mobile);

      try {
        if (!code) {
          throw new Error('尚未获取短信验证码或者已经失效');
        } else if (code !== smscaptcha) {
          throw new Error('短信验证码不正确');
        }
      } catch(err) {
        ctx.throw(400, err.message);
      }
    } else {
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        ctx.throw(400, '密码错误');
      }
    }

    // 返回JWT
    const token = jwt.sign({ id: user.id, role: user.role }, config.secret, { expiresIn: '1h' });
    ctx.body = `Bearer ${token}`;
  }

  // 忘记密码
  async forgetPass(ctx) {
    const { mobile, newPass, smscaptcha } = ctx.request.body;
    const code = await getRedis(mobile);

    try {
      if (!mobile || !/^1[3,5,7,8,9]\d{9}$/.test(mobile)) {
        throw new Error('手机号格式不正确');
      } else if (!newPass || !/(?!^(\d+|[a-zA-Z]+|[~!@#$%^&*?]+)$)^[\w~!@#$%^&*?].{6,18}/.test(newPass)) {
        throw new Error('新密码必须为数字、字母和特殊字符其中两种组成并且在6-18位之间');
      } else if (!code) {
        throw new Error('尚未获取短信验证码或者已经失效');
      } else if (code !== smscaptcha) {
        throw new Error('短信验证码不正确');
      }
    } catch(err) {
      ctx.throw(400, err.message);
    }

    const user = await UserProxy.getUserByMobile(mobile);

    // 判断用户是否存在
    if (!user) {
      ctx.throw(410, '尚未注册');
    }

    const bcryptPassword = await this._encryption(newPass);

    // 修改为新密码
    user.password = bcryptPassword;
    await user.save();

    ctx.body = '';
  }

  // 当前用户信息
  async getUserInfo(ctx) {
    const { id } = ctx.state.user;
    const user = await UserProxy.getUserById(id);
    ctx.body = user;
  }

  // 更新个人信息
  async updateSetting(ctx) {
    const { id } = ctx.state.user;
    const { nickname } = ctx.request.body;

    const user = await UserProxy.getUserByNickname(nickname);
    if (user) {
      ctx.throw(409, '昵称已经注册过了');
    }

    await UserProxy.updateUserById(id, { ...ctx.request.body });
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
    const isMatch = await bcrypt.compare(oldPass, user.password);

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

  // 获取星标用户列表
  async getStar(ctx) {
    const users = await UserProxy.getUsersByQuery({ star: true });
    ctx.body = users;
  }

  // 获取积分榜前一百用户列表
  async getTop100(ctx) {
    const users = await UserProxy.getUsersByQuery({}, '', { limit: 100, sort: '-score' });
    ctx.body = users;
  }

  // 根据ID获取用户信息
  async getInfoById(ctx) {
    const { uid } = ctx.request.params;

    const user = await UserProxy.getUserById(uid);

    if (!user) {
      ctx.throw(410, '用户不存在');
    }

    const { user: crtUser } = ctx.state || {};

    let follow = false;

    if (crtUser) {
      const action = await ActionProxy.getAction('follow', crtUser.id, uid);
      if (action && action.is_un === false) {
        follow = true;
      } else {
        follow = false;
      }
    }

    ctx.body = { ...user.toObject({ virtuals: true }), follow };
  }

  // 获取用户动态
  async getUserAction(ctx) {
    const { uid } = ctx.request.params;

    const actions = await ActionProxy.getActionByQuery({ author_id: uid, is_un: false });
    const result = await Promise.all(actions.map(item => {
      return new Promise(resolve => {
        if (item.type === 'follow') {
          resolve(UserProxy.getUserById(item.target_id, 'id nickname signature avatar'));
        } else {
          resolve(TopicProxy.getTopicById(item.target_id, 'id title'));
        }
      });
    }));

    const data = actions.map((item, i) => {
      return { ...result[i].toObject({ virtuals: true }), type: item.type };
    });

    ctx.body = data;
  }

  // 获取用户专栏的列表
  async getUserCreate(ctx) {
    const { uid } = ctx.request.params;

    const actions = await ActionProxy.getActionByQuery({ type: 'create', author_id: uid, is_un: false });
    const data = await Promise.all(actions.map(item => {
      return new Promise(resolve => {
        resolve(TopicProxy.getTopicById(item.target_id, 'id title star_count collect_count visit_count'));
      });
    }));

    ctx.body = data;
  }

  // 获取用户喜欢列表
  async getUserLike(ctx) {
    const { uid } = ctx.request.params;

    const actions = await ActionProxy.getActionByQuery({ type: 'like', author_id: uid, is_un: false });
    const data = await Promise.all(actions.map(item => {
      return new Promise(resolve => {
        resolve(TopicProxy.getTopicById(item.target_id, 'id title'));
      });
    }));

    ctx.body = data;
  }

  // 获取用户收藏列表
  async getUserCollect(ctx) {
    const { uid } = ctx.request.params;

    const actions = await ActionProxy.getActionByQuery({ type: 'collect', author_id: uid, is_un: false });
    const data = await Promise.all(actions.map(item => {
      return new Promise(resolve => {
        resolve(TopicProxy.getTopicById(item.target_id, 'id title'));
      });
    }));

    ctx.body = data;
  }

  // 获取用户粉丝列表
  async getUserFollower(ctx) {
    const { uid } = ctx.request.params;

    const actions = await ActionProxy.getActionByQuery({ type: 'follow', target_id: uid, is_un: false });
    const data = await Promise.all(actions.map(item => {
      return new Promise(resolve => {
        resolve(UserProxy.getUserById(item.author_id, 'id nickname avatar'));
      });
    }));

    ctx.body = data;
  }

  // 获取用户关注的人列表
  async getUserFollowing(ctx) {
    const { uid } = ctx.request.params;

    const actions = await ActionProxy.getActionByQuery({ type: 'follow', author_id: uid, is_un: false });
    const data = await Promise.all(actions.map(item => {
      return new Promise(resolve => {
        resolve(UserProxy.getUserById(item.target_id, 'id nickname avatar'));
      });
    }));

    ctx.body = data;
  }

  // 关注或者取消关注某个用户
  async followOrUnFollow(ctx) {
    const { uid } = ctx.request.params;
    const { id } = ctx.state.user;

    const action = await ActionProxy.setAction('follow', id, uid);
    const targetUser = await UserProxy.getUserById(uid);
    const authorUser = await UserProxy.getUserById(id);

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
      await NoticeProxy.createFollowNotice(id, uid);
    }

    ctx.body = action.toObject({ virtuals: true }).actualType;
  }
}

module.exports = new User();
