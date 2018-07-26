const ReplyProxy = require('../proxy/reply');
const TopicProxy = require('../proxy/topic');
const NoticeProxy = require('../proxy/notice');

class Reply {
  constructor() {
    this.createReply = this.createReply.bind(this);
    this.upReply = this.upReply.bind(this);
  }

  // 创建回复
  async createReply(req, res) {
    const { content, reply_id } = req.body;
    const { tid } = req.params;
    const { id } = req.session.user;

    if (!content) {
      return res.send({
        status: 0,
        type: 'ERROR_NO_CONTENT_OF_REPLY',
        message: '回复内容不能为空'
      });
    }

    const topic = await TopicProxy.getTopicById(tid);

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

    return res.send({
      status: 1
    });
  }

  // 删除评论
  async deleteReply(req, res) {
    const { rid } = req.params;
    const { id } = req.session.user;

    const reply = await ReplyProxy.getReplyById(rid);

    if (!reply.author_id.equals(id)) {
      return res.send({
        status: 0,
        message: '不能删除别人的回复'
      });
    }

    const topic = await TopicProxy.getTopicById(reply.topic_id);

    topic.reply_count -= 1;
    await topic.save();

    await ReplyProxy.deleteReplyById(rid);

    return res.send({
      status: 1
    });
  }

  // 编辑回复
  async editReply(req, res) {
    const { rid } = req.params;
    const { id } = req.session.user;

    const reply = await ReplyProxy.getReplyById(rid);

    if (!reply.author_id.equals(id)) {
      return res.send({
        status: 0,
        message: '不能编辑别人的评论'
      });
    }

    const { content } = req.body;

    if (!content) {
      return res.send({
        status: 0,
        message: '回复内容不能为空'
      });
    }

    await ReplyProxy.updateReplyById(rid, { content });

    return res.send({
      status: 1
    });
  }

  // 回复点赞
  async upReply(req, res) {
    const { rid } = req.params;
    const { id } = req.session.user;

    const reply = await ReplyProxy.getReplyById(rid);

    if (reply.author_id.equals(id)) {
      return res.send({
        status: 0,
        message: '不能给自己点赞哟'
      });
    }

    let action;

    const upIndex = reply.ups.indexOf(id);

    if (upIndex === -1) {
      reply.ups.push(id);
      action = 'up';
      await NoticeProxy.createUpReplyNotice(id, reply.author_id, reply.id);
    } else {
      reply.ups.splice(upIndex, 1);
      action = 'down';
    }

    await reply.save();

    return res.send({
      status: 1,
      data: action
    });
  }
}

module.exports = new Reply();
