const ReplyProxy = require('../proxy/reply');
const TopicProxy = require('../proxy/topic');
const NoticeProxy = require('../proxy/notice');

class Reply {
  constructor() {
    this.createReply = this.createReply.bind(this);
    this.upReply = this.upReply.bind(this);
  }

  // 创建回复
  async createReply(ctx) {
    const { id } = ctx.state.user;
    const { tid } = ctx.request.params;

    const topic = await TopicProxy.getTopicById(tid);

    if (!topic) {
      ctx.throw(410, '话题不存在');
    }

    const { content, reply_id } = ctx.request.body;

    if (!content) {
      ctx.throw(400, '回复内容不能为空');
    }

    // 创建回复
    const reply = await ReplyProxy.createReply(content, id, tid, reply_id);

    // 修改最后一次回复
    await TopicProxy.updateTopicLastReply(tid, reply.id);

    // 发送提醒
    if (reply_id) {
      await NoticeProxy.createAtNotice(id, topic.author_id, topic.id, reply.id);
    } else {
      await NoticeProxy.createReplyNotice(id, topic.author_id, topic.id);
    }

    ctx.body = '';
  }

  // 删除评论
  async deleteReply(ctx) {
    const { id } = ctx.state.user;
    const { rid } = ctx.request.params;

    const reply = await ReplyProxy.getReplyById(rid);

    if (!reply) {
      ctx.throw(410, '回复不存在');
    }

    if (!reply.author_id.equals(id)) {
      ctx.throw(403, '不能删除别人的回复');
    }

    // 修改话题回复数
    const topic = await TopicProxy.getTopicById(reply.topic_id);

    topic.reply_count -= 1;
    await topic.save();

    // 删除回复
    await ReplyProxy.deleteReplyById(rid);

    ctx.body = '';
  }

  // 编辑回复
  async editReply(ctx) {
    const { id } = ctx.state.user;
    const { rid } = ctx.request.params;

    const reply = await ReplyProxy.getReplyById(rid);

    if (!reply) {
      ctx.throw(410, '回复不存在');
    }

    if (!reply.author_id.equals(id)) {
      ctx.throw(403, '不能编辑别人的评论');
    }

    const { content } = ctx.request.body;

    if (!content) {
      ctx.throw(400, '回复内容不能为空');
    }

    reply.content = content;
    await reply.save();

    ctx.body = '';
  }

  // 回复点赞
  async upReply(ctx) {
    const { id } = ctx.state.user;
    const { rid } = ctx.request.params;

    const reply = await ReplyProxy.getReplyById(rid);

    if (!reply) {
      ctx.throw(410, '回复不存在');
    }

    if (reply.author_id.equals(id)) {
      ctx.throw(403, '不能给自己点赞哟');
    }

    let action;

    const upIndex = reply.ups.indexOf(id);

    if (upIndex === -1) {
      reply.ups.push(id);
      action = 'up';
      // 发送提醒
      await NoticeProxy.createUpReplyNotice(id, reply.author_id, reply.id);
    } else {
      reply.ups.splice(upIndex, 1);
      action = 'down';
    }

    await reply.save();

    ctx.body = action;
  }
}

module.exports = new Reply();
