const ReplyModel = require('../model/reply');
const TopicModel = require('../model/topic');
const NoticeModel = require('../model/notice');

class Reply {
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

  // 获取回复列表
  async roleGetReplyList(ctx) {
    const { page = 1, size = 10 } = ctx.query;

    const [list, total] = await Promise.all([
      ReplyModel.aggregate([
        { $sort: { created_at: -1 } },
        { $limit: +size },
        { $skip: (+page - 1) * size },
        {
          $lookup: {
            from: 'user',
            localField: 'aid',
            foreignField: '_id',
            as: 'author',
          },
        },
        { $unwind: { path: '$author', preserveNullAndEmptyArrays: true } },
        {
          $lookup: {
            from: 'topic',
            localField: 'tid',
            foreignField: '_id',
            as: 'topic',
          },
        },
        { $unwind: { path: '$topic', preserveNullAndEmptyArrays: true } },
        {
          $project: {
            content: 1,
            created_at: 1,
            topic_id: '$topic._id',
            topic_title: '$topic.title',
            author_id: '$author._id',
            author_name: '$author.nickname',
          },
        },
      ]),
      ReplyModel.countDocuments(),
    ]);

    ctx.body = { list, total };
  }

  // 删除回复
  async roleDeleteReply(ctx) {
    const { rid } = ctx.params;

    const reply = await ReplyModel.findByIdAndDelete(rid);

    if (!reply) {
      ctx.throw(404, '回复不存在');
    }

    ctx.body = '';
  }
}

module.exports = new Reply();
