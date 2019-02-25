const API = require('../utils/api');
const md2html = require('../utils/md2html');

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
        error: err.message
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
        error: err.message
      });
    }
  }

  // 搜索结果页
  async renderSearch(req, res) {
    const { q } = req.query;

    const noReplyTopic = await API.getTopicsNoReply();
    const data = await API.searchTopics({ title: q });

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

  // 话题详情页
  async renderDetail(req, res) {
    const { tid } = req.params;

    const noReplyTopic = await API.getTopicsNoReply();
    const data = await API.getTopicById(tid);

    return res.render('pages/topic/detail', {
      title: '话题详情',
      topic: {
        ...data.topic,
        content: md2html(data.topic.content)
      },
      author: data.author,
      replies: data.replies,
      like: data.like,
      collect: data.collect,
      noReplyTopic
    });
  }

  // 喜欢或者取消喜欢
  async likeOrUn(req, res) {
    const { tid } = req.params;

    try {
      const action = await API.likeOrUn(tid);

      return res.send({
        status: 1,
        action
      });
    } catch(err) {
      return res.send({
        status: 0,
        message: err.message
      });
    }
  }

  // 收藏或者取消收藏
  async collectOrUn(req, res) {
    const { tid } = req.params;

    try {
      const action = await API.collectOrUn(tid);

      return res.send({
        status: 1,
        action
      });
    } catch(err) {
      return res.send({
        status: 0,
        message: err.message
      });
    }
  }
}

module.exports = new Topic();
