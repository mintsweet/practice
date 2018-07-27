const bcrypt = require('bcryptjs');
const UserProxy = require('../proxy/user');
const ActionProxy = require('../proxy/action');
const TopicProxy = require('../proxy/topic');
const NoticeProxy = require('../proxy/notice');

class User {
  constructor() {
    this.SALT_WORK_FACTOR = 10;
    this.signup = this.signup.bind(this);
    this.forgetPass = this.forgetPass.bind(this);
    this.updatePass = this.updatePass.bind(this);
  }

  // 注册
  async signup(req, res) {
    const sms_code = req.session.sms_code || {};
    const { mobile, password, nickname, smscaptcha } = req.body;

    try {
      if (!mobile || !/^1[3,5,7,8,9]\d{9}$/.test(mobile)) {
        throw new Error('手机号格式错误');
      } else if (!password || !/(?!^(\d+|[a-zA-Z]+|[~!@#$%^&*?]+)$)^[\w~!@#$%^&*?].{6,18}/.test(password)) {
        throw new Error('密码必须为数字、字母和特殊字符其中两种组成并且在6至18位之间');
      } else if (!nickname || nickname.length > 8 || nickname.length < 2) {
        throw new Error('请输入2至8位的昵称');
      } else if (Number(sms_code.mobile) !== mobile) {
        throw new Error('收取验证码的手机与登录手机不匹配');
      } else if (sms_code.code !== smscaptcha) {
        throw new Error('短信验证码不正确');
      } else if (Date.now() > sms_code.expired) {
        throw new Error('短信验证码已经失效了，请重新获取');
      }
    } catch(err) {
      return res.send({
        status: 0,
        message: err.message
      });
    }

    let existUser;

    existUser = await UserProxy.getUserByMobile(mobile);
    if (existUser) {
      return res.send({
        status: 0,
        message: '手机号已经存在'
      });
    }

    existUser = await UserProxy.getUserByNickname(nickname);
    if (existUser) {
      return res.send({
        status: 0,
        message: '昵称已经存在'
      });
    }

    const bcryptPassword = await this._encryption(password);

    await UserProxy.createUser(mobile, bcryptPassword, nickname);

    return res.send({
      status: 1
    });
  }

  async _encryption(password) {
    const salt = await bcrypt.genSalt(this.SALT_WORK_FACTOR);
    const hash = await bcrypt.hash(password, salt);
    return hash;
  }

  // 登录
  async signin(req, res) {
    const { mobile, password, issms, smscaptcha } = req.body;

    if (!mobile || !/^1[3,5,7,8,9]\d{9}$/.test(mobile)) {
      return res.send({
        status: 0,
        message: '手机号格式错误'
      });
    }

    const existUser = await UserProxy.getUserByMobile(mobile);
    if (!existUser) {
      return res.send({
        status: 0,
        message: '尚未注册'
      });
    }

    if (issms) {
      const sms_code = req.session.sms_code || {};

      try {
        if (Number(sms_code.mobile) !== mobile) {
          throw new Error('收取验证码的手机与登录手机不匹配');
        } else if (sms_code.code !== smscaptcha) {
          throw new Error('短信验证码不正确');
        } else if (Date.now() > sms_code.expired) {
          throw new Error('短信验证码已经失效了，请重新获取');
        }
      } catch(err) {
        return res.send({
          status: 0,
          message: err.message
        });
      }

      req.session.user = existUser;

      return res.send({
        status: 1,
        data: existUser
      });
    } else {
      const isMatch = await bcrypt.compare(password, existUser.password);

      if (!isMatch) {
        return res.send({
          status: 0,
          message: '用户密码错误'
        });
      }

      req.session.user = existUser;

      return res.send({
        status: 1
      });
    }
  }

  // 登出
  signout(req, res) {
    req.session.user = null;
    return res.send({
      status: 1
    });
  }

  // 忘记密码
  async forgetPass(req, res) {
    const { mobile, newPass, smscaptcha } = req.body;
    const sms_code = req.session.sms_code || {};

    try {
      if (!mobile || !/^1[3,5,7,8,9]\d{9}$/.test(mobile)) {
        throw new Error('手机号格式错误');
      } else if (!newPass || !/(?!^(\d+|[a-zA-Z]+|[~!@#$%^&*?]+)$)^[\w~!@#$%^&*?].{6,18}/.test(newPass)) {
        throw new Error('新密码必须为数字、字母和特殊字符其中两种组成并且在6-18位之间');
      } else if (Number(sms_code.mobile) !== mobile) {
        throw new Error('提交手机号与获取验证码手机号不对应');
      } else if (sms_code.code !== smscaptcha) {
        throw new Error('验证码错误');
      } else if (Date.now() > sms_code.expired) {
        throw new Error('验证码已失效，请重新获取');
      }
    } catch(err) {
      return res.send({
        status: 0,
        message: err.message
      });
    }

    const existUser = await UserProxy.getUserByMobile(mobile);
    if (!existUser) {
      return res.send({
        status: 0,
        message: '尚未注册'
      });
    }

    const bcryptPassword = await this._encryption(newPass);

    await UserProxy.updateUserById(existUser.id, { password: bcryptPassword });

    return res.send({
      status: 1
    });
  }

  // 获取当前用户信息
  getUserInfo(req, res) {
    return res.send({
      status: 1,
      data: req.session.user
    });
  }

  // 更新个人信息
  async updateUserInfo(req, res) {
    const { id, nickname: currentNickname } = req.session.user;
    const { nickname } = req.body;

    const existUser = await UserProxy.getUserByNickname(nickname);
    if (existUser && nickname !== currentNickname) {
      return res.send({
        status: 0,
        message: '昵称已经注册过了'
      });
    }

    const doc = await UserProxy.updateUserById(id, { ...req.body }, { new: true });

    req.session.user = doc;

    return res.send({
      status: 1
    });
  }

  // 修改密码
  async updatePass(req, res) {
    const { id } = req.session.user;
    const { oldPass, newPass } = req.body;

    try {
      if (!oldPass) {
        throw new Error('旧密码不能为空');
      } else if (!newPass || !/(?!^(\d+|[a-zA-Z]+|[~!@#$%^&*?]+)$)^[\w~!@#$%^&*?].{6,18}/.test(newPass)) {
        throw new Error('新密码必须为数字、字母和特殊字符其中两种组成并且在6-18位之间');
      }
    } catch(err) {
      return res.send({
        status: 0,
        message: err.message
      });
    }

    const existUser = await UserProxy.getUserById(id);
    const isMatch = await bcrypt.compare(oldPass, existUser.password);

    if (isMatch) {
      const bcryptPassword = await this._encryption(newPass);
      await UserProxy.updateUserById(id, { password: bcryptPassword });

      return res.send({
        status: 1
      });
    } else {
      return res.send({
        status: 0,
        message: '旧密码错误'
      });
    }
  }

  // 获取星标用户列表
  async getStarList(req, res) {
    const query = {
      star: true
    };

    const userList = await UserProxy.getUsersByQuery(query);

    return res.send({
      status: 1,
      data: userList
    });
  }

  // 获取积分榜前一百用户
  async getTop100(req, res) {
    const option = {
      sort: '-scroe',
      limit: 100
    };

    const userList = await UserProxy.getUsersByQuery({}, '', option);

    return res.send({
      status: 1,
      data: userList
    });
  }

  // 根据ID获取用户信息
  async getInfoById(req, res) {
    const { uid } = req.params;

    const currentUser = await UserProxy.getUserById(uid);

    if (!currentUser) {
      return res.send({
        status: 0,
        message: '无效的ID'
      });
    }

    const user = req.session.user || {};

    let follow = false;

    if (user.id) {
      const action = await ActionProxy.getAction('follow', user.id, uid);
      if (action && action.is_un === false) {
        follow = true;
      } else {
        follow = false;
      }
    }

    return res.send({
      status: 1,
      data: { ...currentUser.toObject({ virtuals: true }), follow }
    });
  }

  // 获取用户动态
  async getUserAction(req, res) {
    const { uid } = req.params;

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

    return res.send({
      status: 1,
      data
    });
  }

  // 获取用户专栏的列表
  async getUserCreate(req, res) {
    const { uid } = req.params;

    const actions = await ActionProxy.getActionByQuery({ type: 'create', author_id: uid, is_un: false });
    const data = await Promise.all(actions.map(item => {
      return new Promise(resolve => {
        resolve(TopicProxy.getTopicById(item.target_id, 'id title star_count collect_count visit_count'));
      });
    }));

    return res.send({
      status: 1,
      data
    });
  }

  // 获取用户喜欢列表
  async getUserLike(req, res) {
    const { uid } = req.params;

    const actions = await ActionProxy.getActionByQuery({ type: 'like', author_id: uid, is_un: false });
    const data = await Promise.all(actions.map(item => {
      return new Promise(resolve => {
        resolve(TopicProxy.getTopicById(item.target_id, 'id title'));
      });
    }));

    return res.send({
      status: 1,
      data
    });
  }

  // 获取用户收藏列表
  async getUserCollect(req, res) {
    const { uid } = req.params;

    const actions = await ActionProxy.getActionByQuery({ type: 'collect', author_id: uid, is_un: false });
    const data = await Promise.all(actions.map(item => {
      return new Promise(resolve => {
        resolve(TopicProxy.getTopicById(item.target_id, 'id title'));
      });
    }));

    return res.send({
      status: 1,
      data
    });
  }

  // 获取用户粉丝列表
  async getUserFollower(req, res) {
    const { uid } = req.params;

    const actions = await ActionProxy.getActionByQuery({ type: 'follow', target_id: uid, is_un: false });
    const data = await Promise.all(actions.map(item => {
      return new Promise(resolve => {
        resolve(UserProxy.getUserById(item.author_id, 'id nickname avatar'));
      });
    }));

    return res.send({
      status: 1,
      data
    });
  }

  // 获取用户关注的人列表
  async getUserFollowing(req, res) {
    const { uid } = req.params;

    const actions = await ActionProxy.getActionByQuery({ type: 'follow', author_id: uid, is_un: false });
    const data = await Promise.all(actions.map(item => {
      return new Promise(resolve => {
        resolve(UserProxy.getUserById(item.target_id, 'id nickname avatar'));
      });
    }));

    return res.send({
      status: 1,
      data
    });
  }

  // 关注或者取消关注某个用户
  async followOrUnFollow(req, res) {
    const { uid } = req.params;
    const { id } = req.session.user;

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


    return res.send({
      status: 1,
      data: action.toObject({ virtuals: true }).actualType
    });
  }
}

module.exports = new User();
