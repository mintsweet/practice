const API = require('../utils/api');

class Reply {
  // 创建回复
  async createReply(req, res) {
    const { tid } = req.params;

    try {
      await API.createReply(tid, req.body);

      return res.render('pages/transform', {
        title: '创建回复成功',
        type: 'success',
        message: '创建回复成功',
        url: `/topic/${tid}`
      });
    } catch(err) {
      return res.render('pages/transform', {
        title: '创建回复失败',
        type: 'error',
        message: err.error,
        url: `/topic/${tid}`
      });
    }
  }

  // 删除回复
  async deleteReply(req, res) {
    const { rid } = req.params;

    try {
      await API.deleteReply(rid);

      return res.send({
        status: 1
      });
    } catch(err) {
      return res.send({
        status: 0,
        message: err.error
      });
    }
  }

  // 编辑回复
  async editReply(req, res) {
    const { rid } = req.params;
    const { tid, content } = req.body;

    try {
      await API.editReply(rid, { content });

      return res.render('pages/transform', {
        title: '编辑回复成功',
        type: 'success',
        message: '编辑回复成功',
        url: `/topic/${tid}`
      });
    } catch(err) {
      return res.render('pages/transform', {
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

    try {
      const action = await API.upReply(rid);
      return res.send({
        status: 1,
        action
      });
    } catch(err) {
      return res.send({
        status: 0,
        messsage: err.error
      });
    }
  }
}

module.exports = new Reply();
