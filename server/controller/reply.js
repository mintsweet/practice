const formidable = require('formidable');
const BaseComponent = require('../prototype/BaseComponent');
const ReplyModel = require('../models/reply');

class Reply extends BaseComponent {
  constructor() {
    super();
    this.createReply = this.createReply.bind(this);
  }

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

      const { userInfo } = req.session;
      const { content, topic_id, author_id, reply_id } = fields;

      try {
        if (!userInfo || !userInfo.id) {
          throw new Error('尚未登录');
        } else if (!content) {
          throw new Error('回复内容不能为空');
        } else if (!topic_id) {
          throw new Error('回复主题不能为空');
        } else if (!author_id) {
          throw new Error('回复者不能为空');
        }
      } catch(err) {
        return res.send({
          status: 0,
          type: 'ERROR_PARAMS',
          message: err.message
        });
      }

      const replyId = await this.getId('reply_id');
      const replyInfo = {
        id: replyId,
        content,
        topic_id,
        author_id,
        reply_id
      };

      try {
        await ReplyModel.create(replyInfo);
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

      const { id, content } = fields;

      try {
        if (!id) {
          throw new Error('无修改内容');
        } else if (!content) {
          throw new Error('回复内容不能为空');
        }
      } catch(err) {
        return res.send({
          status: 0,
          type: 'ERROR_PARAMS',
          message: err.message
        });
      }

      try {
        await ReplyModel.findOneAndUpdate({ id }, { content });
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

  deleteReply(req, res) {
    const form = new formidable.IncomingForm();
    form.parse(req, async (err, fields, files) => {
      if (err) {
        return res.send({
          status: 0,
          type: 'ERROR_PARMAS',
          message: '参数解析失败'
        });
      }

      const { id } = fields;

      
      try {
        if (!id) {
          throw new Error('无删除内容');
        }
      } catch(err) {
        return res.send({
          status: 0,
          type: 'ERROR_PARAMS',
          message: err.message
        });
      }

      try {
        await ReplyModel.findOneAndDelete({ id });
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

  async upReply(req, res) {
    const { rid } = req.params;

    if (!rid) {
      return res.send({
        status: 0,
        type: 'ERROR_PARAMS',
        message: '无效的ID'
      });
    }

    const { userInfo } = req.session;
    const currentReply = await ReplyModel.findOne({ id: rid });
    let action;
    const upIndex = currentReply.ups.indexOf(userInfo.id);
    if (upIndex === -1) {
      currentReply.ups.push(userInfo.id);
      action = 'up';
    } else {
      currentReply.ups.push(upIndex, 1);
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
