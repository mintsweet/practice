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

  // 编辑话题页
  async renderEdit(req, res) {
    const { tid } = req.params;

    const data = await API.getTopicById(tid);

    return res.render('pages/topic/create', {
      title: '编辑话题',
      topic: data.topic
    });
  }

  // 编辑话题
  async editTopic(req, res) {
    const { tid } = req.params;

    try {
      await API.editTopic(tid, req.body);

      return res.render('pages/transform', {
        title: '编辑话题成功',
        type: 'success',
        message: '编辑话题成功'
      });
    } catch(err) {
      return res.render('pages/topic/create', {
        title: '编辑话题',
        error: err.error
      });
    }
  }

  // 搜索结果页
  async renderSearch(req, res) {
    const { q } = req.query;

    const noReplyTopic = await API.getNoReplyTopic();
    const data = await API.getTopicBySearch({ title: q });

    return res.render('pages/topic/search', {
      title: '搜索结果',
      topics: data.topics,
      currentPage: data.currentPage,
      totalPage: data.totalPage,
      total: data.total,
      q,
      noReplyTopic
    });
  }
}

module.exports = new Topic();
