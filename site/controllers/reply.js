const formidable = require('formidable');
const { createReply, deleteReply, editReply, upReply } = require('../http/api');

class Reply {
  // 创建回复
  async createReply(req, res) {
    const { tid } = req.params;
    const form = new formidable.IncomingForm();
    form.parse(req, async (err, fields) => {
      if (err) {
        throw new Error(err);
      }

      try {
        await createReply(tid, fields);

        return res.render('site/transform', {
          title: '创建回复成功',
          type: 'success',
          message: '创建回复成功',
          url: `/topic/${tid}`
        });
      } catch(err) {
        return res.render('site/transform', {
          title: '创建回复失败',
          type: 'error',
          message: err.message,
          url: `/topic/${tid}`
        });
      }
    });
  }

  // 删除回复
  async deleteReply(req, res) {
    const { rid } = req.params;
    try {
      await deleteReply(rid);

      return res.send({
        status: 1
      });
    } catch(err) {
      return res.send({
        status: 0,
        message: err.message
      });
    }
  }

  // 编辑回复
  async editReply(req, res) {
    const { rid } = req.params;
    const form = new formidable.IncomingForm();
    form.parse(req, async (err, fields) => {
      if (err) {
        throw new Error(err);
      }

      try {
        await editReply(rid, fields);

        return res.send({
          status: 1
        });
      } catch(err) {
        return res.redirect('/exception/500');
      }
    });
  }

  // 点赞回复
  async upReplyOrUn(req, res) {
    const { rid } = req.params;
    try {
      await upReply(rid);

      return res.send({
        status: 1
      });
    } catch(err) {
      return res.send({
        status: 0,
        messsage: err.message
      });
    }
  }
}

module.exports = new Reply();
