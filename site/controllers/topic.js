const md2html = require('../utils/md2html');
const {
  createTopic, deleteTopic, editTopic,
  getTopicDetail, starOrUnstarTopic, getNoReplyTopic,
  getTopicBySearch, collectOrUncollectTopic
} = require('../http/api');

class Topic {
  constructor() {
    this.renderDetail = this.renderDetail.bind(this);
    this.renderSearch = this.renderSearch.bind(this);
  }

  // 创建话题
  renderCreate(req, res) {
    return res.render('topic/create', {
      title: '发布话题',
      action: 'create'
    });
  }

  // 创建话题
  async createTopic(req, res) {
    try {
      await createTopic(req.body);

      return res.render('transform/index', {
        title: '发布话题成功',
        type: 'success',
        message: '发布话题成功'
      });
    } catch(err) {
      return res.render('topic/create', {
        title: '发布话题',
        error: err.message
      });
    }
  }

  // 删除话题
  async deleteTopic(req, res) {
    const { tid } = req.params;

    try {
      await deleteTopic(tid);

      return res.render('/transform/index', {
        title: '删除话题',
        type: 'success',
        message: '删除话题成功'
      });
    } catch(err) {
      return res.render('/transform/index', {
        title: '删除话题失败',
        type: 'error',
        message: '删除话题失败'
      });
    }
  }

  // 编辑话题页
  async renderEdit(req, res) {
    const { tid } = req.params;
    const data = await getTopicDetail(tid);

    return res.render('topic/create', {
      title: '编辑话题',
      topic: data,
      action: 'edit'
    });
  }

  // 编辑话题
  async editTopic(req, res) {
    try {
      await editTopic(req.body);

      return res.render('transform/index', {
        title: '编辑话题成功',
        type: 'success',
        message: '编辑话题成功'
      });
    } catch(err) {
      return res.render('topic/create', {
        title: '编辑话题',
        error: err.message
      });
    }
  }

  // 话题详情页
  async renderDetail(req, res) {
    const { tid } = req.params;

    const noReplyTopic = await getNoReplyTopic();
    const data = await getTopicDetail(tid);

    return res.render('topic/detail', {
      title: '话题详情',
      topic: { ...data.topic, content: md2html(data.topic.content) },
      author: { ...data.author },
      replies: data.replies,
      like: data.like,
      collect: data.collect,
      noReplyTopic
    });
  }

  // 搜索结果页
  async renderSearch(req, res) {
    const { q } = req.query;

    const noReplyTopic = await getNoReplyTopic();
    const data = await getTopicBySearch({ title: q });

    return res.render('topic/search', {
      title: '搜索结果',
      topics: data.topics,
      currentPage: data.currentPage,
      totalPage: data.totalPage,
      total: data.total,
      q,
      noReplyTopic
    });
  }

  // 喜欢或者取消喜欢
  async starOrUnstarTopic(req, res) {
    const { tid } = req.params;
    const { user } = req.app.locals;

    if (!user) {
      return res.send({
        status: 0,
        message: '尚未登录'
      });
    }

    try {
      const action = await starOrUnstarTopic(tid);

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
  async collectOrUncollectTopic(req, res) {
    const { tid } = req.params;
    const { user } = req.app.locals;

    if (!user) {
      return res.send({
        status: 0,
        message: '尚未登录'
      });
    }

    try {
      const action = await collectOrUncollectTopic(tid);

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
