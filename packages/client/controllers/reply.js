const API = require('../utils/api');

class Reply {
  // 创建回复
  async createReply(req, res) {
    const { token } = req.session;
    const { tid } = req.params;

    try {
      await API.createReply(tid, req.body, token);

      res.redirect(`/topic/${tid}`);
    } catch(err) {
      res.redirect(`/topic/${tid}`);
    }
  }

  // 删除回复
  async deleteReply(req, res) {
    const { token } = req.session;
    const { rid } = req.params;

    try {
      await API.deleteReply(rid, token);

      return res.send({ status: 1 });
    } catch(err) {
      return res.send({ status: 0, message: err.message });
    }
  }

  // 编辑回复
  async editReply(req, res) {
    const { token } = req.session;
    const { rid } = req.params;
    const { tid, content } = req.body;

    try {
      await API.editReply(rid, { content }, token);

      res.redirect(`/topic/${tid}`);
    } catch(err) {
      res.redirect(`/topic/${tid}`);
    }
  }

  // 点赞回复
  async upReplyOrUn(req, res) {
    const { token } = req.session;
    const { rid } = req.params;

    try {
      const action = await API.upOrDown(rid, token);
      return res.send({ status: 1, action });
    } catch(err) {
      return res.send({ status: 0, messsage: err.error });
    }
  }
}

module.exports = new Reply();
