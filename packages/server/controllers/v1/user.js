const Base = require('../base');
const UserProxy = require('../../proxy/user');
const ActionProxy = require('../../proxy/action');
const TopicProxy = require('../../proxy/topic');
const NoticeProxy = require('../../proxy/notice');

class User extends Base {
  // 获取积分榜用户列表
  async getUserTop(ctx) {
    const { count = 10 } = ctx.query;
    const limit = parseInt(count);
    const users = await UserProxy.get({}, 'nickname avatar score topic_count like_count collect_count follow_count', { limit, sort: '-score' });
    ctx.body = users;
  }

  // 根据ID获取用户信息
  async getUserById(ctx) {
    const { uid } = ctx.params;
    const { user: current } = ctx.state;

    const user = await UserProxy.getById(uid, 'nickname avatar location signature score like_count collect_count follower_count following_count');

    if (!user) {
      ctx.throw(404, '用户不存在');
    }

    let follow;

    if (current) {
      follow = await ActionProxy.getOne({
        type: 'follow',
        author_id: current.id,
        target_id: user.id
      });
    }

    follow = (follow && !follow.is_un) || false;

    ctx.body = {
      ...user.toObject({ virtuals: true }),
      follow
    };
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
        ...result[i].toObject(),
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

    ctx.body = data.map(item => ({ ...item.toObject(), type: 'like' }));
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

    ctx.body = data.map(item => ({ ...item.toObject(), type: 'collect' }));
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
