const API = require('../utils/api');

class Topic {
  // 创建话题
  renderCreate(req, res) {
    return res.render('pages/topic/create', {
      title: '发布话题'
    });
  }

  // 创建话题
  async createTopic(req, res) {
    try {
      await API.createTopic(req.body);

      return res.render('pages/transform', {
        title: '发布话题成功',
        type: 'success',
        message: '发布话题成功'
      });
    } catch(err) {
      return res.render('pages/topic/create', {
        title: '发布话题',
        error: err.error
      });
    }
  }

  // 删除话题
  async deleteTopic(req, res) {
    const { tid } = req.params;

    try {
      await API.deleteTopic(tid);

      return res.render('pages/transform', {
        title: '删除话题',
        type: 'success',
        message: '删除话题成功'
      });
    } catch(err) {
      return res.render('pages/transform', {
        title: '删除话题失败',
        type: 'error',
        message: '删除话题失败'
      });
    }
  }
}

module.exports = new Topic();
