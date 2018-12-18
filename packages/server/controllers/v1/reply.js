const ReplyProxy = require('../../proxy/reply');
const TopicProxy = require('../../proxy/topic');
const NoticeProxy = require('../../proxy/notice');

class Reply {
  // 创建回复
  async createReply(ctx) {
    const { id } = ctx.state.user;
    const { tid } = ctx.params;

    const topic = await TopicProxy.getById(tid);

    if (!topic) {
      ctx.throw(404, '话题不存在');
    }

    const { content, reply_id } = ctx.request.body;

    if (!content) {
      ctx.throw(400, '回复内容不能为空');
    }

    const _reply = {
      content,
      author_id: id,
      topic_id: tid,
    };

    if (reply_id) {
      _reply.reply_id = reply_id;
    }

    // 创建回复
    const reply = await ReplyProxy.create(_reply);

    // 修改最后一次回复
    await TopicProxy.update({ id: tid }, { last_reply: id });

    // 发送提醒
    if (reply_id) {
      await NoticeProxy.create({
        type: 'at',
        author_id: id,
        target_id: topic.author_id,
        topic_id: topic.id,
        reply_id: reply.id
      });
    } else {
      await NoticeProxy.create({
        type: 'reply',
        author_id: id,
        target_id: topic.author_id,
        topic_id: topic.id
      });
    }

    ctx.body = '';
  }
}

module.exports = new Reply();
