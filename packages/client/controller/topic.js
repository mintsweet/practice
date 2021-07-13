const API = require('../utils/api');

class Topic {
  // 创建话题
  async createTopic(req, res) {
    const { token } = req.session;

    try {
      await API.createTopic(req.body, token);
      res.render('pages/jump', {
        type: 'success',
        url: '/',
        message: '创建话题成功',
      });
    } catch (err) {
      res.render('pages/topic-create', {
        title: '发布话题',
        error: err.message,
      });
    }
  }

  // 删除话题
  async deleteTopic(req, res) {
    const { token } = req.session;
    const { tid } = req.params;

    try {
      await API.deleteTopic(tid, token);
      res.render('pages/jump', {
        type: 'success',
        url: '/',
        message: '删除话题成功',
      });
    } catch (err) {
      res.render('pages/jump', {
        type: 'success',
        url: `/topic/${tid}`,
        message: '删除话题失败',
      });
    }
  }

  // 编辑话题
  async editTopic(req, res) {
    const { token } = req.session;
    const { tid } = req.params;

    try {
      await API.editTopic(tid, req.body, token);
      res.render('pages/jump', {
        type: 'success',
        url: `/topic/${tid}`,
        message: '编辑话题成功',
      });
    } catch (err) {
      res.render('pages/topic-create', {
        title: '编辑话题',
        error: err.message,
      });
    }
  }

  // 喜欢或者取消喜欢
  async likeTopic(req, res) {
    const { token } = req.session;
    const { tid } = req.params;

    try {
      const action = await API.likeTopic(tid, token);
      res.send({ status: 1, action });
    } catch (err) {
      res.send({ status: 0, message: err.message });
    }
  }

  // 收藏或者取消收藏
  async collectOrUn(req, res) {
    const { token } = req.session;
    const { tid } = req.params;

    try {
      const action = await API.collectOrUn(tid, token);
      res.send({ status: 1, action });
    } catch (err) {
      return res.send({ status: 0, message: err.message });
    }
  }

  // 创建回复
  async createReply(req, res) {
    const { token } = req.session;
    const { tid } = req.params;

    try {
      await API.createReply(tid, req.body, token);

      res.render('pages/jump', {
        type: 'success',
        url: `/topic/${tid}`,
        message: '创建回复成功',
      });
    } catch (err) {
      res.render('pages/jump', {
        type: 'error',
        url: `/topic/${tid}`,
        message: '创建回复失败',
      });
    }
  }

  // 点赞回复
  async upReplyOrUn(req, res) {
    const { token } = req.session;
    const { rid } = req.params;

    try {
      const action = await API.upOrDown(rid, token);
      res.send({ status: 1, action });
    } catch (err) {
      res.send({ status: 0, messsage: err.error });
    }
  }
}

module.exports = new Topic();
