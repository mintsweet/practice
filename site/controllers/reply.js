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
        // return res.redirect(`/topic/${tid}`);
      } catch(err) {
        // return res.redirect('/exception/500');
      }
    });
  }

  // 删除回复
  async deleteReply(req, res) {
    const { tid } = req.params;

    await deleteReply(tid);
    // return res.redirect(`/topic/${tid}`);
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
        // return res.redirect(`/topic/${tid}`);
      } catch(err) {
        // return res.redirect('/exception/500');
      }
    });
  }

  // 点赞回复
  async upReplyOrUn(req, res) {
    const { rid } = req.params;

    await upReply(rid);
    // return res.redirect(`/topic/${tid}`);
  }
}

module.exports = new Reply();
