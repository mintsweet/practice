// const moment = require('moment');
const { Types } = require('mongoose');
const ActionModel = require('../model/action');
const TopicModel = require('../model/topic');
const UserModel = require('../model/user');
const ReplyModel = require('../model/reply');
const NoticeModel = require('../model/notice');

class Topic {
  // 获取列表
  async getTopicList(ctx) {
    const { tab = 'all', page = 1, size = 10 } = ctx.query;

    const query = {
      is_lock: false,
      is_delete: false,
    };

    if (tab === 'good') {
      query.is_good = true;
    } else if (tab !== 'all') {
      query.tab = tab;
    }

    const [list, total] = await Promise.all([
      TopicModel.aggregate([
        { $match: query },
        {
          $sort: {
            top: -1,
            good: -1,
            last_reply_at: -1,
            created_at: -1,
          },
        },
        {
          $skip: (page - 1) * size,
        },
        {
          $limit: +size,
        },
        {
          $lookup: {
            from: 'user',
            localField: 'aid',
            foreignField: '_id',
            as: 'author',
          },
        },
        {
          $unwind: {
            path: '$author',
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $project: {
            is_top: 1,
            is_good: 1,
            like_count: 1,
            collect_count: 1,
            reply_count: 1,
            visit_count: 1,
            tab: 1,
            title: 1,
            author_id: '$author._id',
            author_name: '$author.nickname',
            author_avatar: '$author.avatar',
          },
        },
      ]),
      TopicModel.countDocuments(query),
    ]);

    ctx.body = {
      list,
      total,
    };
  }

  // 搜索话题
  async searchTopic(ctx) {
    const { title = '', page = 1, size = 10 } = ctx.query;

    const query = {
      title: { $regex: title },
      is_lock: false,
      is_delete: false,
    };

    const [list, total] = await Promise.all([
      TopicModel.aggregate([
        {
          $match: query,
        },
        {
          $sort: {
            top: -1,
            good: -1,
            last_reply_at: -1,
            created_at: -1,
          },
        },
        {
          $skip: (page - 1) * size,
        },
        {
          $limit: +size,
        },
        {
          $lookup: {
            from: 'user',
            localField: 'aid',
            foreignField: '_id',
            as: 'author',
          },
        },
        {
          $unwind: {
            path: '$author',
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $project: {
            is_top: 1,
            is_good: 1,
            like_count: 1,
            collect_count: 1,
            reply_count: 1,
            visit_count: 1,
            tab: 1,
            title: 1,
            author_id: '$author._id',
            author_name: '$author.nickname',
            author_avatar: '$author.avatar',
          },
        },
      ]),
      TopicModel.countDocuments(query),
    ]);

    ctx.body = {
      list,
      total,
    };
  }

  // 获取无人回复话题
  async getNoReplyTopic(ctx) {
    const { count = 10 } = ctx.query;

    const data = await TopicModel.find({
      is_lock: false,
      is_delete: false,
      reply_count: 0,
    })
      .sort({ top: -1, good: -1, last_reply_at: -1, created_at: -1 })
      .select({ id: 1, title: 1 })
      .limit(+count);

    ctx.body = data;
  }

  // 创建话题
  async createTopic(ctx) {
    const { id } = ctx.state.user;
    const { tab, title, content } = ctx.request.body;

    try {
      if (!tab) {
        throw new Error('话题标签不能为空');
      } else if (!title) {
        throw new Error('话题标题不能为空');
      } else if (!content) {
        throw new Error('话题内容不能为空');
      }
    } catch (err) {
      ctx.throw(400, err.message);
    }

    // 创建话题
    const topic = await TopicModel.create({
      tab,
      title,
      content,
      aid: id,
    });

    // 积分、话题数量累积
    await UserModel.updateOne(
      { _id: id },
      {
        $inc: {
          score: 1,
          topic_count: 1,
        },
      },
    );

    // 创建行为
    await ActionModel.create({
      type: 'create',
      aid: id,
      tid: topic.id,
    });

    ctx.body = '';
  }

  // 删除话题
  async deleteTopic(ctx) {
    const { id } = ctx.state.user;
    const { tid } = ctx.params;

    const topic = await TopicModel.findOne({
      _id: tid,
      is_delete: false,
    });

    if (!topic) {
      ctx.throw(404, '话题不存在');
    }

    if (!topic.aid.equals(id)) {
      ctx.throw(403, '不能删除别人的话题');
    }

    // 话题伪删除、行为反向
    await Promise.all([
      TopicModel.updateOne(
        {
          tid,
        },
        {
          is_delete: true,
        },
      ),
      ActionModel.updateOne(
        { type: 'create', aid: id, tid },
        {
          is_un: false,
        },
      ),
    ]);

    ctx.body = '';
  }

  // 编辑话题
  async updateTopic(ctx) {
    const { id } = ctx.state.user;
    const { tid } = ctx.params;
    const { tab, title, content } = ctx.request.body;

    const topic = await TopicModel.findOne({
      _id: tid,
      is_delete: false,
    });

    if (!topic) {
      ctx.throw(404, '话题不存在');
    }

    if (!topic.aid.equals(id)) {
      ctx.throw(403, '不能编辑别人的话题');
    }

    await TopicModel.updateOne(
      {
        tid,
      },
      {
        tab: tab || topic.tab,
        title: title || topic.title,
        content: content || topic.content,
      },
    );

    ctx.body = '';
  }

  // 获取话题详情
  async getTopicById(ctx) {
    const { user } = ctx.state;
    const { tid } = ctx.params;

    // 访问计数
    const result = await TopicModel.updateOne(
      {
        _id: tid,
        is_delete: false,
      },
      {
        $inc: {
          visit_count: 1,
        },
      },
      {
        new: true,
      },
    );

    if (!result || !result.n) {
      ctx.throw(404, '话题不存在');
    }

    let aid = Types.ObjectId();
    if (user) aid = user.id;

    // 获取详情
    const [data] = await TopicModel.aggregate([
      { $match: { _id: Types.ObjectId(tid) } },
      {
        $lookup: {
          from: 'user',
          localField: 'aid',
          foreignField: '_id',
          as: 'author',
        },
      },
      {
        $unwind: {
          path: '$author',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: 'reply',
          let: { tid: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ['$tid', '$$tid'],
                },
              },
            },
            {
              $lookup: {
                from: 'user',
                localField: 'aid',
                foreignField: '_id',
                as: 'author',
              },
            },
            {
              $unwind: {
                path: '$author',
                preserveNullAndEmptyArrays: true,
              },
            },
            {
              $lookup: {
                from: 'action',
                let: { tid: '$_id' },
                pipeline: [
                  {
                    $match: {
                      type: 'up',
                      aid: Types.ObjectId(aid),
                      $expr: {
                        $eq: ['$tid', '$$tid'],
                      },
                    },
                  },
                ],
                as: 'up',
              },
            },
            {
              $unwind: {
                path: '$up',
                preserveNullAndEmptyArrays: true,
              },
            },
            {
              $project: {
                content: 1,
                created_at: 1,
                is_up: { $ifNull: ['$up.is_un', false] },
                author_id: '$author._id',
                author_nickname: '$author.nickname',
                author_avatar: '$author.avatar',
              },
            },
          ],
          as: 'replys',
        },
      },
      {
        $lookup: {
          from: 'action',
          let: { tid: '$_id' },
          pipeline: [
            {
              $match: {
                type: 'like',
                aid: Types.ObjectId(aid),
                $expr: {
                  $eq: ['$tid', '$$tid'],
                },
              },
            },
          ],
          as: 'like',
        },
      },
      {
        $unwind: {
          path: '$like',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: 'action',
          let: { tid: '$_id' },
          pipeline: [
            {
              $match: {
                type: 'collect',
                aid: Types.ObjectId(aid),
                $expr: {
                  $eq: ['$tid', '$$tid'],
                },
              },
            },
          ],
          as: 'collect',
        },
      },
      {
        $unwind: {
          path: '$collect',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          is_top: 1,
          is_good: 1,
          like_count: 1,
          collect_count: 1,
          reply_count: 1,
          visit_count: 1,
          tab: 1,
          title: 1,
          content: 1,
          created_at: 1,
          author_id: '$author._id',
          author_nickname: '$author.nickname',
          author_avatar: '$author.avatar',
          author_location: '$author.location',
          author_signature: '$author.signature',
          author_score: '$author.score',
          replys: 1,
          is_like: { $ifNull: ['$like.is_un', false] },
          is_collect: { $ifNull: ['$collect.is_un', false] },
        },
      },
    ]);

    ctx.body = data;
  }

  // 喜欢或者取消喜欢话题
  async liekTopic(ctx) {
    const { id } = ctx.state.user;
    const { tid } = ctx.params;

    const topic = await TopicModel.findOne({
      _id: tid,
      is_delete: false,
    });

    if (!topic) {
      ctx.throw(404, '话题不存在');
    }

    if (topic.aid.equals(id)) {
      ctx.throw(403, '不能喜欢自己的话题');
    }

    // 行为反向
    const actionParam = {
      type: 'like',
      aid: id,
      tid: topic._id,
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

    // 点赞数加减、积分加减
    await Promise.all([
      TopicModel.updateOne(
        { tid },
        {
          $inc: {
            like_count: action.is_un ? 1 : -1,
          },
        },
      ),
      UserModel.updateOne(
        { _id: topic.aid },
        {
          $inc: {
            score: action.is_un ? 5 : -5,
          },
        },
      ),
    ]);

    if (action.is_un) {
      await NoticeModel.updateOne(
        {
          type: 'like',
          aid: id,
          uid: topic.aid,
          tid,
        },
        {},
        { upsert: true },
      );
    }

    ctx.body = action.is_un ? 'like' : 'un_like';
  }

  // 收藏或者取消收藏话题
  async collectTopic(ctx) {
    const { id } = ctx.state.user;
    const { tid } = ctx.params;

    const topic = await TopicModel.findOne({
      _id: tid,
      is_delete: false,
    });

    if (!topic) {
      ctx.throw(404, '话题不存在');
    }

    if (topic.aid.equals(id)) {
      ctx.throw(403, '不能喜欢自己的话题');
    }

    // 行为反向
    const actionParam = {
      type: 'collect',
      aid: id,
      tid: topic._id,
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

    // 点赞数加减、积分加减
    await Promise.all([
      TopicModel.updateOne(
        { tid },
        {
          $inc: {
            collect_count: action.is_un ? 1 : -1,
          },
        },
      ),
      UserModel.updateOne(
        {
          _id: topic.aid,
        },
        {
          $inc: {
            score: action.is_un ? 3 : -3,
          },
        },
      ),
    ]);

    if (action.is_un) {
      await NoticeModel.updateOne(
        {
          type: 'collect',
          aid: id,
          uid: topic.aid,
          tid,
        },
        {},
        { upsert: true },
      );
    }

    ctx.body = action.is_un ? 'collect' : 'un_collect';
  }

  // 创建回复
  async createReply(ctx) {
    const { id } = ctx.state.user;
    const { tid } = ctx.params;
    const { content } = ctx.request.body;

    const topic = await TopicModel.findOne({
      _id: tid,
      is_delete: false,
    });

    if (!topic) {
      ctx.throw(404, '话题不存在');
    }

    if (!content) {
      ctx.throw(400, '回复内容不能为空');
    }

    // 创建回复
    const reply = await ReplyModel.create({
      content,
      aid: id,
      tid,
    });

    // 更新话题相关信息
    await TopicModel.updateOne(
      { tid },
      {
        $inc: {
          reply_count: 1,
        },
        last_reply_id: reply._id,
        last_reply_at: new Date(),
      },
    );

    // 发送提醒
    await NoticeModel.create({
      type: 'reply',
      uid: topic.aid,
      aid: id,
      tid,
    });

    ctx.body = '';
  }

  // 点赞回复
  async upReply(ctx) {
    const { id } = ctx.state.user;
    const { rid } = ctx.params;

    const reply = await ReplyModel.findById(rid);

    if (!reply) {
      ctx.throw(404, '回复不存在');
    }

    if (reply.aid.equals(id)) {
      ctx.throw(403, '不能给自己点赞哟');
    }

    // 行为反向
    const action = await ActionModel.findOne({
      type: 'up',
      aid: id,
      tid: reply._id,
    });

    if (!action) {
      await Promise.all([
        ActionModel.create({
          type: 'up',
          aid: id,
          tid: reply._id,
        }),
        NoticeModel.create({
          type: 'up',
          aid: id,
          uid: reply.aid,
        }),
      ]);
    }

    ctx.body = '';
  }

  // 获取话题列表
  async roleGetTopicList(ctx) {
    const { page, size } = ctx.query;

    const [list, total] = await Promise.all([
      TopicModel.find({})
        .select({ password: 0 })
        .sort({ created_at: -1 })
        .limit(+size)
        .skip((+page - 1) * size),
      TopicModel.countDocuments(),
    ]);

    ctx.body = { list, total };
  }

  // 创建话题
  async roleCreateTopic(ctx) {
    const { id } = ctx.state.user;
    const { tab, title, content } = ctx.request.body;

    try {
      if (!tab) {
        throw new Error('话题标签不能为空');
      } else if (!title) {
        throw new Error('话题标题不能为空');
      } else if (!content) {
        throw new Error('话题内容不能为空');
      }
    } catch (err) {
      ctx.throw(400, err.message);
    }

    // 创建话题
    const topic = await TopicModel.create({
      tab,
      title,
      content,
      aid: id,
    });

    // 积分、话题数量累积
    await UserModel.updateOne(
      { _id: id },
      {
        $inc: {
          score: 1,
          topic_count: 1,
        },
      },
    );

    // 创建行为
    await ActionModel.create({
      type: 'create',
      aid: id,
      tid: topic.id,
    });

    ctx.body = '';
  }

  // 删除话题(超管物理删除)
  async roleDeleteTopic(ctx) {
    const { tid } = ctx.params;

    const topic = await TopicModel.findByIdAndDelete(tid);

    if (!topic) {
      ctx.throw(404, '话题不存在');
    }

    await ActionModel.deleteOne({
      type: 'create',
      aid: topic.aid,
      tid,
    });

    ctx.body = '';
  }

  // 更新话题
  async roleUpdateTopic(ctx) {
    const { tid } = ctx.params;
    const { tab, title, content } = ctx.request.body;
    const updated = {};

    if (tab) updated.tab = tab;
    if (title) updated.title = title;
    if (content) updated.content = content;

    const topic = await TopicModel.findByIdAndUpdate(tid, updated);

    if (!topic) {
      ctx.throw(404, '话题不存在');
    }

    ctx.body = '';
  }

  // 话题置顶
  async roleTopTopic(ctx) {
    const { tid } = ctx.params;
    const topic = await TopicModel.findById(tid);

    if (!topic) {
      ctx.throw(404, '话题不存在');
    }

    await TopicModel.findByIdAndUpdate(tid, {
      is_top: !topic.is_top,
    });

    // 用户积分变化
    await UserModel.findByIdAndUpdate(topic.aid, {
      $inc: {
        score: topic.is_top ? -20 : 20,
      },
    });

    ctx.body = topic.is_top ? 'un_top' : 'top';
  }

  // 话题加精
  async roleGoodTopic(ctx) {
    const { tid } = ctx.params;
    const topic = await TopicModel.findById(tid);

    if (!topic) {
      ctx.throw(404, '话题不存在');
    }

    await TopicModel.findByIdAndUpdate(tid, {
      is_good: !topic.is_good,
    });

    // 用户积分变化
    await UserModel.findByIdAndUpdate(topic.aid, {
      $inc: {
        score: topic.is_good ? -10 : 10,
      },
    });

    ctx.body = topic.is_good ? 'un_good' : 'good';
  }

  // 话题锁定(封贴)
  async roleLockTopic(ctx) {
    const { tid } = ctx.params;
    const topic = await TopicModel.findById(tid);

    if (!topic) {
      ctx.throw(404, '话题不存在');
    }

    await TopicModel.findByIdAndUpdate(tid, {
      is_lock: !topic.is_lock,
    });

    ctx.body = topic.is_lock ? 'un_lock' : 'lock';
  }
}

module.exports = new Topic();
