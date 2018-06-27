const formidable = require('formidable');
const BaseComponent = require('../prototype/BaseComponent');
const ReplyModel = require('../models/reply');
const md2html = require('../utils/md2html');
const logger = require('../utils/logger');

class Reply extends BaseComponent {
  constructor() {
    super();
    this.createReply = this.createReply.bind(this);
  }

  // 创建恢复
  createReply(req, res) {
    const form = new formidable.IncomingForm();
    form.parse(req, async (err, fields, files) => {
      if (err) {
        return res.send({
          status: 0,
          type: 'ERROR_PARMAS',
          message: '参数解析失败'
        });
      }

      const { tid } = req.params;
      const { _id } = req.session.userInfo;
      const { content, reply_id } = fields;

      try {
        if (!content) {
          throw new Error('回复内容不能为空');
        } else if (!tid) {
          throw new Error('回复主题不能为空');
        }
      } catch(err) {
        return res.send({
          status: 0,
          type: 'ERROR_PARAMS_FOR_CREATE_REPLY',
          message: err.message
        });
      }

      const replyInfo = {
        content: md2html(content),
        topic_id: tid,
        author_id: _id,
        reply_id
      };

      try {
        await ReplyModel.create(replyInfo);
        return res.send({
          status: 1
        });
      } catch(err) {
        logger.error(err.message);
        return res.send({
          status: 0,
          type: 'ERROR_SERVICE_FAILED',
          message: '服务器无响应，请稍后重试'
        });
      }
    });
  }

  // 删除评论
  async deleteReply(req, res) {
    const { rid } = req.params;

    if (!rid) {
      return res.send({
        status: 0,
        type: 'ERROR_PARAMS',
        message: '无效的ID'
      });
    }

    const { _id } = req.session.userInfo;
    const currentReply = await ReplyModel.findById(rid);

    if (_id !== currentReply.author_id.toString()) {
      return res.send({
        status: 0,
        type: 'ERROR_IS_NOT_AUTHOR',
        message: '不能删除别人的话题'
      });
    } else {
      await ReplyModel.findByIdAndRemove(rid);
      return res.send({
        status: 1
      });
    }
  }

  // 编辑回复
  editReply(req, res) {
    const form = new formidable.IncomingForm();
    form.parse(req, async (err, fields, files) => {
      if (err) {
        return res.send({
          status: 0,
          type: 'ERROR_PARMAS',
          message: '参数解析失败'
        });
      }

      const { rid } = req.params;
      const { _id } = req.session.userInfo;
      const currentReply = await ReplyModel.findById(rid);

      if (_id !== currentReply.author_id.toString()) {
        return res.send({
          status: 0,
          type: 'ERROR_IS_NOT_AUTHOR',
          message: '不能编辑别人的评论'
        });
      }

      const { content } = fields;

      const _reply = {
        content: md2html(content) || currentReply.content
      };

      try {
        await ReplyModel.findByIdAndUpdate(rid, _reply);
        return res.send({
          status: 1
        });
      } catch(err) {
        return res.send({
          status: 0,
          type: 'ERROR_SERVICE_FAILED',
          message: '服务器无响应，请稍后重试'
        });
      }
    });
  }

  // 回复点赞
  async upReply(req, res) {
    const { rid } = req.params;

    if (!rid) {
      return res.send({
        status: 0,
        type: 'ERROR_PARAMS',
        message: '无效的ID'
      });
    }

    const { _id } = req.session.userInfo;
    const currentReply = await ReplyModel.findById(rid);

    if (currentReply.author_id.equals(_id)) {
      return res.send({
        status: 0,
        type: 'ERROR_YOURSELF_NOT_DO_IT',
        message: '不能给自己点赞'
      });
    }

    let action;

    const upIndex = currentReply.ups.indexOf(_id);
    if (upIndex === -1) {
      currentReply.ups.push(_id);
      action = 'up';
    } else {
      currentReply.ups.splice(upIndex, 1);
      action = 'down';
    }

    currentReply.save(function() {
      return res.send({
        status: 1,
        action
      });
    });
  }
}

module.exports = new Reply();
