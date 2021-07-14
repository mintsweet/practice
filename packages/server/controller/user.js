const { Types } = require('mongoose');
const jwt = require('jsonwebtoken');
const uuid = require('uuid/v4');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const {
  jwt: { SECRET, EXPIRSE, REFRESH },
  SALT_WORK_FACTOR,
} = require('../../../config');
const redis = require('../db/redis');
const UserModel = require('../model/user');
const ReplyModel = require('../model/reply');
const TopicModel = require('../model/topic');
const ActionModel = require('../model/action');
const NoticeModel = require('../model/notice');

const EMAIL_REGEXP = /^([A-Za-z0-9_\-.])+@([A-Za-z0-9_\-.])+\.([A-Za-z]{2,4})$/;
const PASSWORD_REGEXP = /(?!^(\d+|[a-zA-Z]+|[~!@#$%^&*?]+)$)^[\w~!@#$%^&*?].{6,18}/;

const forgetPassKey = key => `FORGET_PASS_${key}`;

class User {
  constructor() {
    this.signup = this.signup.bind(this);
    this.signin = this.signin.bind(this);
    this.forgetPass = this.forgetPass.bind(this);
    this.resetPass = this.resetPass.bind(this);
    this.updatePass = this.updatePass.bind(this);
    this.getUserNotice = this.getUserNotice.bind(this);
    this.getSystemNotice = this.getSystemNotice.bind(this);
    this.roleCreateUser = this.roleCreateUser.bind(this);
  }

  // 密码加密
  async _encryption(password) {
    const salt = await bcrypt.genSalt(SALT_WORK_FACTOR);
    const hash = await bcrypt.hash(password, salt);
    return hash;
  }

  // 密码比较
  async _comparePass(pass, passTrue) {
    const isMatch = await bcrypt.compare(pass, passTrue);
    return isMatch;
  }

  // md5加密
  async _md5(value) {
    const md5 = crypto.createHash('md5');
    return md5.update(value).digest('hex');
  }

  // 注册
  async signup(ctx) {
    const { email, password, nickname } = ctx.request.body;

    try {
      if (!email || !EMAIL_REGEXP.test(email)) {
        throw new Error('邮箱格式不正确');
      } else if (!password || !PASSWORD_REGEXP.test(password)) {
        throw new Error(
          '密码必须为数字、字母和特殊字符其中两种组成并且在6至18位之间',
        );
      } else if (!nickname || nickname.length > 10 || nickname.length < 2) {
        throw new Error('昵称必须在2至10位之间');
      }
    } catch (err) {
      ctx.throw(400, err.message);
    }

    let existUser;

    existUser = await UserModel.findOne({ email });

    if (existUser) {
      ctx.throw(409, '邮箱已经注册过了');
    }

    existUser = await UserModel.findOne({ nickname });

    if (existUser) {
      ctx.throw(409, '昵称已经注册过了');
    }

    // 密码加密
    const bcryptPassword = await this._encryption(password);

    await UserModel.create({
      email,
      password: bcryptPassword,
      nickname,
    });

    ctx.body = '';
  }

  // 登录
  async signin(ctx) {
    const { email, password } = ctx.request.body;

    // 校验邮箱
    if (!email || !EMAIL_REGEXP.test(email)) {
      ctx.throw(400, '邮箱格式错误');
    }

    const user = await UserModel.findOne({ email });

    // 判断用户是否存在, 提示防遍历
    if (!user) {
      ctx.throw(400, '用户名或密码错误');
    }

    const isMatch = await this._comparePass(password, user.password);

    if (!isMatch) {
      ctx.throw(400, '用户名或密码错误');
    }

    // 返回JWT
    const token = jwt.sign(
      {
        id: user.id,
        role: user.role,
        exp: Date.now() + EXPIRSE,
        ref: Date.now() + REFRESH,
      },
      SECRET,
    );

    ctx.body = `Bearer ${token}`;
  }

  // 忘记密码
  async forgetPass(ctx) {
    const { email } = ctx.request.body;

    // 校验邮箱
    if (!email || !EMAIL_REGEXP.test(email)) {
      ctx.throw(400, '邮箱格式错误');
    }

    const user = await UserModel.findOne({ email });

    // 判断用户是否存在
    if (!user) {
      ctx.throw(404, '尚未注册');
    }

    // 加密
    const token = await this._md5(`${user.email}&${uuid()}`);
    await redis.set(forgetPassKey(email), token, 'EX', 60 * 30);

    ctx.body = token;
  }

  // 重置密码
  async resetPass(ctx) {
    const { email, token, new_pass } = ctx.request.body;

    const secret = await redis.get(forgetPassKey(email));

    if (secret !== token) {
      ctx.throw(400, '链接不正确');
    }

    if (!new_pass || !PASSWORD_REGEXP.test(new_pass)) {
      ctx.throw(
        400,
        '新密码必须为数字、字母和特殊字符其中两种组成并且在6-18位之间',
      );
    }

    const password = await this._encryption(new_pass);
    await UserModel.updateOne({ email }, { password });

    ctx.body = '';
  }

  // 获取当前用户信息
  async getUser(ctx) {
    const { id } = ctx.state.user;
    const user = await UserModel.findById(id, {
      email: 1,
      nickname: 1,
      avatar: 1,
      location: 1,
      signature: 1,
      score: 1,
    });
    ctx.body = user;
  }

  // 更新个人信息
  async updateSetting(ctx) {
    const { id } = ctx.state.user;
    const { nickname, location, signature } = ctx.request.body;

    const user = await UserModel.findOne({ nickname });

    if (user && user._id.toString() !== id) {
      ctx.throw(409, '昵称已经注册过了');
    }

    await UserModel.updateOne(
      { _id: id },
      {
        nickname,
        location,
        signature,
      },
    );

    ctx.body = '';
  }

  // 修改密码
  async updatePass(ctx) {
    const { id } = ctx.state.user;
    const { old_pass, new_pass } = ctx.request.body;

    try {
      if (!old_pass) {
        throw new Error('旧密码不能为空');
      } else if (!new_pass || !PASSWORD_REGEXP.test(new_pass)) {
        throw new Error(
          '新密码必须为数字、字母和特殊字符其中两种组成并且在6-18位之间',
        );
      }
    } catch (err) {
      ctx.throw(400, err.message);
    }

    const user = await UserModel.findById(id);
    const isMatch = await this._comparePass(old_pass, user.password);

    if (!isMatch) {
      ctx.throw(400, '旧密码错误');
    }

    const password = await this._encryption(new_pass);

    await UserModel.updateOne(
      {
        _id: id,
      },
      {
        password,
      },
    );

    ctx.body = '';
  }

  // 转化消息格式
  async _normalNotice(item) {
    const data = {};

    switch (item.type) {
      case 'like':
        data.author = await UserModel.findById(
          item.author_id,
          'id nickname avatar',
        );
        data.topic = await TopicModel.findById(item.topic_id, 'id title');
        data.typeName = '喜欢了';
        break;
      case 'collect':
        data.author = await UserModel.findById(
          item.author_id,
          'id nickname avatar',
        );
        data.topic = await TopicModel.findById(item.topic_id, 'id title');
        data.typeName = '收藏了';
        break;
      case 'follow':
        data.author = await UserModel.findById(
          item.author_id,
          'id nickname avatar',
        );
        data.typeName = '新的关注者';
        break;
      case 'reply':
        data.author = await UserModel.findById(
          item.author_id,
          'id nickname avatar',
        );
        data.topic = await TopicModel.findById(item.topic_id, 'id title');
        data.typeName = '回复了';
        break;
      default:
        data.typeName = '系统消息';
        break;
    }

    return { ...data, ...item };
  }

  // 获取用户消息
  async getUserNotice(ctx) {
    const { id } = ctx.state.user;

    const notices = await NoticeModel.find({
      uid: id,
      type: { $ne: 'system' },
    });

    const data = await Promise.all(
      notices.map(item => {
        return new Promise(resolve => {
          resolve(this._normalNotice(item.toObject()));
        });
      }),
    );

    ctx.body = data;
  }

  // 获取系统消息
  async getSystemNotice(ctx) {
    const { id } = ctx.state.user;

    const notices = await NoticeModel.find({
      uid: id,
      type: 'system',
    });

    const data = await Promise.all(
      notices.map(item => {
        return new Promise(resolve => {
          resolve(this._normalNotice(item.toObject()));
        });
      }),
    );

    ctx.body = data;
  }

  // 获取积分榜用户列表
  async getUserTop(ctx) {
    const { count = 10 } = ctx.query;
    const data = await UserModel.find({})
      .select({
        nickname: 1,
        avatar: 1,
        score: 1,
        topic_count: 1,
        like_count: 1,
        collect_count: 1,
        follow_count: 1,
      })
      .sort({
        score: -1,
      })
      .limit(+count);

    ctx.body = data;
  }

  // 根据ID获取用户信息
  async getUserById(ctx) {
    const { uid } = ctx.params;
    const { user: current } = ctx.state;

    const user = await UserModel.findById(uid);

    if (!user) {
      ctx.throw(404, '用户不存在');
    }

    let aid = Types.ObjectId();
    if (current) aid = current.id;

    const [data] = await UserModel.aggregate([
      {
        $match: {
          _id: Types.ObjectId(uid),
        },
      },
      {
        $lookup: {
          from: 'action',
          let: { tid: '$_id' },
          pipeline: [
            {
              $match: {
                type: 'follow',
                aid: Types.ObjectId(aid),
                $expr: {
                  $eq: ['$tid', '$$tid'],
                },
              },
            },
          ],
          as: 'follow',
        },
      },
      {
        $unwind: {
          path: '$follow',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          nickname: 1,
          avatar: 1,
          location: 1,
          signature: 1,
          score: 1,
          like_count: 1,
          collect_count: 1,
          follower_count: 1,
          following_count: 1,
          is_follow: { $ifNull: ['$follow.is_un', false] },
        },
      },
    ]);

    ctx.body = data;
  }

  // 获取用户动态
  async getUserAction(ctx) {
    const { uid } = ctx.params;

    const user = await UserModel.findById(uid);

    if (!user) {
      ctx.throw(404, '用户不存在');
    }

    const actions = await ActionModel.find({ aid: uid, is_un: true });

    const result = await Promise.all(
      actions.map(item => {
        return new Promise(resolve => {
          if (item.type === 'follow') {
            resolve(
              UserModel.findById(item.tid, 'id nickname signature avatar'),
            );
          } else {
            resolve(TopicModel.findById(item.tid, 'id title'));
          }
        });
      }),
    );

    const data = actions.map((item, i) => {
      return {
        ...result[i].toObject(),
        type: item.type,
      };
    });

    ctx.body = data;
  }

  // 获取用户专栏的列表
  async getUserCreate(ctx) {
    const { uid } = ctx.params;

    const user = await UserModel.findById(uid);

    if (!user) {
      ctx.throw(404, '用户不存在');
    }

    const data = await ActionModel.aggregate([
      {
        $match: {
          type: 'create',
          aid: Types.ObjectId(uid),
          is_un: true,
        },
      },
      {
        $lookup: {
          from: 'topic',
          localField: 'tid',
          foreignField: '_id',
          as: 'topic',
        },
      },
      {
        $unwind: {
          path: '$topic',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          topic_id: '$topic._id',
          topic_title: '$topic.title',
          topic_like_count: '$topic.like_count',
          topic_collect_count: '$topic.collect_count',
          topic_visit_count: '$topic.visit_count',
        },
      },
    ]);

    ctx.body = data;
  }

  // 获取用户喜欢列表
  async getUserLike(ctx) {
    const { uid } = ctx.params;

    const user = await UserModel.findById(uid);

    if (!user) {
      ctx.throw(404, '用户不存在');
    }

    const data = await ActionModel.aggregate([
      {
        $match: {
          type: 'like',
          aid: Types.ObjectId(uid),
          is_un: true,
        },
      },
      {
        $lookup: {
          from: 'topic',
          localField: 'tid',
          foreignField: '_id',
          as: 'topic',
        },
      },
      {
        $unwind: {
          path: '$topic',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          topic_id: '$topic._id',
          topic_title: '$topic.title',
        },
      },
    ]);

    ctx.body = data;
  }

  // 获取用户收藏列表
  async getUserCollect(ctx) {
    const { uid } = ctx.params;

    const user = await UserModel.findById(uid);

    if (!user) {
      ctx.throw(404, '用户不存在');
    }

    const data = await ActionModel.aggregate([
      {
        $match: {
          type: 'collect',
          aid: Types.ObjectId(uid),
          is_un: true,
        },
      },
      {
        $lookup: {
          from: 'topic',
          localField: 'tid',
          foreignField: '_id',
          as: 'topic',
        },
      },
      {
        $unwind: {
          path: '$topic',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          topic_id: '$topic._id',
          topic_title: '$topic.title',
        },
      },
    ]);

    ctx.body = data;
  }

  // 获取用户粉丝列表
  async getUserFollower(ctx) {
    const { uid } = ctx.params;

    const user = await UserModel.findById(uid);

    if (!user) {
      ctx.throw(404, '用户不存在');
    }

    const data = await ActionModel.aggregate([
      {
        $match: {
          type: 'follow',
          tid: Types.ObjectId(uid),
          is_un: true,
        },
      },
      {
        $lookup: {
          from: 'user',
          localField: 'aid',
          foreignField: '_id',
          as: 'user',
        },
      },
      {
        $unwind: {
          path: '$user',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          user_id: '$user._id',
          user_nickname: '$user.nickname',
          user_avatar: '$user.avatar',
        },
      },
    ]);

    ctx.body = data;
  }

  // 获取用户关注的人列表
  async getUserFollowing(ctx) {
    const { uid } = ctx.params;

    const user = await UserModel.findById(uid);

    if (!user) {
      ctx.throw(404, '用户不存在');
    }

    const data = await ActionModel.aggregate([
      {
        $match: {
          type: 'follow',
          aid: Types.ObjectId(uid),
          is_un: true,
        },
      },
      {
        $lookup: {
          from: 'user',
          localField: 'tid',
          foreignField: '_id',
          as: 'user',
        },
      },
      {
        $unwind: {
          path: '$user',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          user_id: '$user._id',
          user_nickname: '$user.nickname',
          user_avatar: '$user.avatar',
        },
      },
    ]);

    ctx.body = data;
  }

  // 关注或者取消关注用户
  async followUser(ctx) {
    const { uid } = ctx.params;
    const { id } = ctx.state.user;

    const user = await UserModel.findById(uid);

    if (!user) {
      ctx.throw(404, '用户不存在');
    }

    if (uid === id) {
      ctx.throw(403, '不能关注你自己');
    }

    // 行为反向
    const actionParam = {
      type: 'follow',
      aid: id,
      tid: uid,
    };

    let action = await ActionModel.findOne(actionParam);

    if (action) {
      action = await ActionModel.updateOne(
        actionParam,
        { is_un: !action.is_un },
        { new: true },
      );
    } else {
      action = await ActionModel.create(actionParam);
    }

    await Promise.all([
      // 当前用户关注数 +/- 1;
      UserModel.findByIdAndUpdate(id, {
        $inc: {
          following_count: action.is_un ? 1 : -1,
        },
      }),
      // 被关注用户粉丝数 +/- 1;
      UserModel.findByIdAndUpdate(uid, {
        $inc: {
          follower_count: action.is_un ? 1 : -1,
        },
      }),
    ]);

    // 推送通知
    if (action.is_un) {
      await NoticeModel.updateOne(
        {
          type: 'follow',
          aid: id,
          uid,
        },
        {},
        { upsert: true },
      );
    }

    ctx.body = '';
  }

  // 用户列表
  async roleGetUserList(ctx) {
    const { page, size } = ctx.query;

    const [list, total] = await Promise.all([
      UserModel.find({})
        .select({ password: 0 })
        .sort({ created_at: -1 })
        .limit(+size)
        .skip((+page - 1) * size),
      UserModel.countDocuments(),
    ]);

    ctx.body = { list, total };
  }

  // 创建用户
  async roleCreateUser(ctx) {
    const { user } = ctx.state;
    const { email, password, nickname, role } = ctx.request.body;

    try {
      if (!email || !EMAIL_REGEXP.test(email)) {
        throw new Error('邮箱格式不正确');
      } else if (!password || !PASSWORD_REGEXP.test(password)) {
        throw new Error(
          '密码必须为数字、字母和特殊字符其中两种组成并且在6至18位之间',
        );
      } else if (!nickname || nickname.length > 10 || nickname.length < 2) {
        throw new Error('昵称必须在2至10位之间');
      } else if (role < 0 || role > 100) {
        throw new Error('权限值必须在0至100之间');
      } else if (user.role < role) {
        throw new Error('权限值不能大于当前用户的权限值');
      }
    } catch (err) {
      ctx.throw(400, err.message);
    }

    let existUser;

    existUser = await UserModel.findOne({ email });
    if (existUser) {
      ctx.throw(409, '手机号已经存在');
    }

    existUser = await UserModel.findOne({ nickname });
    if (existUser) {
      ctx.throw(409, '昵称已经存在');
    }

    const bcryptPassword = await this._encryption(password);

    await UserModel.create({
      email,
      password: bcryptPassword,
      nickname,
      role,
    });

    ctx.body = '';
  }

  // 删除用户(超管物理删除)
  async roleDeleteUser(ctx) {
    const { uid } = ctx.params;

    await UserModel.findByIdAndDelete(uid);

    ctx.body = '';
  }

  // 更新用户
  async roleUpdateUser(ctx) {
    const { uid } = ctx.params;
    const { nickname, location, signature } = ctx.request.body;

    const user = await UserModel.findOne({ nickname });

    if (user && user._id.toString() !== uid) {
      ctx.throw(409, '昵称已经注册过了');
    }

    await UserModel.updateOne(
      { _id: uid },
      {
        nickname,
        location,
        signature,
      },
    );

    ctx.body = '';
  }

  // 设为星标用户
  async roleStarUser(ctx) {
    const { uid } = ctx.params;

    const user = await UserModel.findById(uid);

    if (!user) {
      ctx.throw(404, '未查询到用户');
    }

    await UserModel.updateOne(
      {
        _id: uid,
      },
      {
        is_star: !user.is_star,
      },
    );

    ctx.body = user.is_star ? 'un_star' : 'star';
  }

  // 锁定用户(封号)
  async roleLockUser(ctx) {
    const { uid } = ctx.params;
    const { user: currentUser } = ctx.state;

    const user = await UserModel.findById(uid);

    if (!user) {
      ctx.throw(404, '未查询到用户');
    }

    if (currentUser.role < user.role) {
      ctx.throw(403, '不能操作权限值高于自身的用户');
    }

    await UserModel.updateOne(
      {
        _id: uid,
      },
      {
        is_lock: !user.is_lock,
      },
    );

    ctx.body = user.is_lock ? 'un_lock' : 'lock';
  }
}

module.exports = new User();
