const formidable = require('formidable');
const Base = require('./base');
const ReplyModel = require('../models/reply');
const TopicModel = require('../models/topic');
const UserModel = require('../models/user');

class Reply extends Base {
  constructor() {
    super();
    this.createReply = this.createReply.bind(this);
    this.upReply = this.upReply.bind(this);
  }

  // 创建回复
  createReply(req, res) {
    const form = new formidable.IncomingForm();
    form.parse(req, async (err, fields) => {
      if (err) {
        throw new Error(err);
      }

      const { tid } = req.params;
      const { id } = req.session.user;

      const currentTopic = await TopicModel.findById(tid);

      if (!currentTopic) {
        return res.send({
          status: 0,
          type: 'ERROR_NOT_FIND_TOPIC',
          message: '未找到话题'
        });
      }

      const { content, reply_id } = fields;

      if (!content) {
        return res.send({
          status: 0,
          type: 'ERROR_NO_CONTENT_OF_REPLY',
          message: '回复内容不能为空'
        });
      }

      // 保存回复
      const reply = new ReplyModel();
      reply.content = content;
      reply.topic_id = tid;
      reply.author_id = id;
      if (reply_id) {
        reply.reply_id = reply_id;
      }
      await reply.save();

      // 修改话题
      currentTopic.last_reply = id;
      currentTopic.last_reply_at = new Date();
      currentTopic.reply_count += 1;
      await currentTopic.save();

      // 修改用户
      const createUser = await UserModel.findById(id);
      createUser.reply_count += 1;
      await createUser.save();

      if (reply_id) {
        await this.sendReply2Notice(id, currentTopic.author_id, currentTopic.id, reply_id);
      } else {
        await this.sendReplyNotice(id, currentTopic.author_id, currentTopic.id);
      }

      return res.send({
        status: 1
      });
    });
  }

  // 删除评论
  async deleteReply(req, res) {
    const { rid } = req.params;
    const { id } = req.session.user;

    const currentReply = await ReplyModel.findById(rid);

    if (!currentReply) {
      return res.send({
        status: 0,
        type: 'ERROR_ID_IS_INVALID',
        message: '无效的ID'
      });
    }

    const replyAuthor = await UserModel.findById(currentReply.author_id);
    const replyTopic = await TopicModel.findById(currentReply.topic_id);

    if (!currentReply.author_id.equals(id)) {
      return res.send({
        status: 0,
        type: 'ERROR_IS_NOT_AUTHOR',
        message: '不能删除别人的回复'
      });
    }

    replyTopic.reply_count -= 1;
    replyAuthor.reply_count -= 1;

    await replyTopic.save();
    await replyAuthor.save();

    await currentReply.remove();

    return res.send({
      status: 1
    });
  }

  // 编辑回复
  editReply(req, res) {
    const form = new formidable.IncomingForm();
    form.parse(req, async (err, fields) => {
      if (err) {
        throw new Error(err);
      }

      const { rid } = req.params;
      const { id } = req.session.user;

      const currentReply = await ReplyModel.findById(rid);

      if (!currentReply) {
        return res.send({
          status: 0,
          type: 'ERROR_ID_IS_INVALID',
          message: '无效的ID'
        });
      }

      if (!currentReply.author_id.equals(id)) {
        return res.send({
          status: 0,
          type: 'ERROR_IS_NOT_AUTHOR',
          message: '不能编辑别人的评论'
        });
      }

      const { content } = fields;

      if (!content) {
        return res.send({
          status: 0,
          type: 'ERROR_CONTENT_INVALID',
          message: '回复内容不能为空'
        });
      }

      await ReplyModel.findByIdAndUpdate(rid, { content });
      return res.send({
        status: 1
      });
    });
  }

  // 回复点赞
  async upReply(req, res) {
    const { rid } = req.params;
    const { id } = req.session.user;

    const currentReply = await ReplyModel.findById(rid);

    if (!currentReply) {
      return res.send({
        status: 0,
        type: 'ERROR_ID_IS_INVALID',
        message: '无效的ID'
      });
    }

    if (currentReply.author_id.equals(id)) {
      return res.send({
        status: 0,
        type: 'ERROR_YOURSELF_NOT_DO_IT',
        message: '不能给自己点赞哟'
      });
    }

    let action;

    const upIndex = currentReply.ups.indexOf(id);

    if (upIndex === -1) {
      currentReply.ups.push(id);
      action = 'up';
      await this.sendUpsNotice(id, currentReply.author_id, currentReply.id);
    } else {
      currentReply.ups.splice(upIndex, 1);
      action = 'down';
    }

    await currentReply.save();

    return res.send({
      status: 1,
      action
    });
  }
}

module.exports = new Reply();
