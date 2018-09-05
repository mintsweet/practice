const md2html = require('../utils/md2html');
const {
  createTopic, deleteTopic, editTopic,
  getTopicDetail, getNoReplyTopic, getTopicBySearch,
  likeOrUn, collectOrUn
} = require('../http/api');

class Topic {
  constructor() {
    this.renderDetail = this.renderDetail.bind(this);
    this.renderSearch = this.renderSearch.bind(this);
  }

  // 创建话题
  renderCreate(req, res) {
    return res.render('topic/create', {
      title: '发布话题'
    });
  }

  // 创建话题
  async createTopic(req, res) {
    const { jwt } = req.app.locals;

    try {
      await createTopic(req.body, jwt);

      return res.render('transform/index', {
        title: '发布话题成功',
        type: 'success',
        message: '发布话题成功'
      });
    } catch(err) {
      return res.render('topic/create', {
        title: '发布话题',
        error: err.error
      });
    }
  }

  // 删除话题
  async deleteTopic(req, res) {
    const { tid } = req.params;
    const { jwt } = req.app.locals;

    try {
      await deleteTopic(tid, jwt);

      return res.render('transform/index', {
        title: '删除话题',
        type: 'success',
        message: '删除话题成功'
      });
    } catch(err) {
      return res.render('transform/index', {
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
      topic: data.topic
    });
  }

  // 编辑话题
  async editTopic(req, res) {
    const { tid } = req.params;
    const { jwt } = req.app.locals;

    try {
      await editTopic(tid, req.body, jwt);

      return res.render('transform/index', {
        title: '编辑话题成功',
        type: 'success',
        message: '编辑话题成功'
      });
    } catch(err) {
      return res.render('topic/create', {
        title: '编辑话题',
        error: err.error
      });
    }
  }

  // 话题详情页
  async renderDetail(req, res) {
    const { tid } = req.params;
    const { jwt } = req.app.locals;

    const noReplyTopic = await getNoReplyTopic();
    const data = await getTopicDetail(tid, jwt);

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
  async likeOrUn(req, res) {
    const { tid } = req.params;
    const { jwt } = req.app.locals;

    if (!jwt) {
      return res.send({
        status: 0,
        message: '尚未登录'
      });
    }

    try {
      const action = await likeOrUn(tid, jwt);

      return res.send({
        status: 1,
        action
      });
    } catch(err) {
      return res.send({
        status: 0,
        message: err.error
      });
    }
  }

  // 收藏或者取消收藏
  async collectOrUn(req, res) {
    const { tid } = req.params;
    const { jwt } = req.app.locals;

    if (!jwt) {
      return res.send({
        status: 0,
        message: '尚未登录'
      });
    }

    try {
      const action = await collectOrUn(tid, jwt);

      return res.send({
        status: 1,
        action
      });
    } catch(err) {
      return res.send({
        status: 0,
        message: err.error
      });
    }
  }
}

module.exports = new Topic();
