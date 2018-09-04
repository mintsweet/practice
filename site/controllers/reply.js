const { createReply, deleteReply, editReply, upReply } = require('../http/api');

class Reply {
  // 创建回复
  async createReply(req, res) {
    const { tid } = req.params;
    const { jwt } = req.app.locals;
    try {
      await createReply(tid, req.body, jwt);
      return res.render('transform/index', {
        title: '创建回复成功',
        type: 'success',
        message: '创建回复成功',
        url: `/topic/${tid}`
      });
    } catch(err) {
      return res.render('transform/index', {
        title: '创建回复失败',
        type: 'error',
        message: err.message,
        url: `/topic/${tid}`
      });
    }
  }

  // 删除回复
  async deleteReply(req, res) {
    const { rid } = req.params;
    const { jwt } = req.app.locals;
    try {
      await deleteReply(rid, jwt);
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
    const { jwt } = req.app.locals;
    const { tid, content } = req.body;

    try {
      await editReply(rid, { content }, jwt);
      return res.render('transform/index', {
        title: '编辑回复成功',
        type: 'success',
        message: '编辑回复成功',
        url: `/topic/${tid}`
      });
    } catch(err) {
      return res.render('transform/index', {
        title: '编辑回复失败',
        type: 'error',
        message: '编辑回复失败',
        url: `/topic/${tid}`
      });
    }
  }

  // 点赞回复
  async upReplyOrUn(req, res) {
    const { rid } = req.params;
    const { jwt } = req.app.locals;
    try {
      const action = await upReply(rid, jwt);
      return res.send({
        status: 1,
        action
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
