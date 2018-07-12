const formidable = require('formidable');
const {
  createTopic, getTopicDetail, starOrUnstarTopic,
  getTopicBySearch, getNoReplyTopic, collectOrUncollectTopic
} = require('../http/api');

class Topic {
  // 创建话题
  renderCreateTopic(req, res) {
    res.render('topic/create', {
      title: '发布话题'
    });
  }

  // 创建话题
  createTopic(req, res) {
    const form = new formidable.IncomingForm();
    form.parse(req, async (err, fields) => {
      if (err) {
        return res.redirect('/exception/500');
      }

      const response = await createTopic(fields);

      if (response.status === 1) {
        res.render('site/transform', {
          title: '发布话题成功',
          type: 'success',
          message: '发布话题成功'
        });
      } else {
        return res.render('topic/create', {
          title: '发布话题',
          error: response.message
        });
      }
    });
  }

  // 话题详情页
  async renderDetail(req, res) {
    const { tid } = req.params;

    let response;
    let topic;
    let noReplyTopic;

    response = await getTopicDetail(tid);

    if (response.status === 1) {
      topic = response.data;
    } else {
      return res.redirect('/exception/500');
    }

    response = await getNoReplyTopic();

    if (response.status === 1) {
      noReplyTopic = response.data;
    } else {
      return res.redirect('/exception/500');
    }

    return res.render('topic/detail', {
      title: '话题详情',
      topic,
      noReplyTopic
    });
  }

  // 搜索结果页
  async renderSearch(req, res) {
    const { q } = req.query;

    let response;
    let topics;
    let currentPage;
    let totalPage;
    let total;
    let noReplyTopic;

    response = await getTopicBySearch({ title: q });

    if (response.status === 1) {
      topics = response.data.topics;
      currentPage = response.data.currentPage;
      totalPage = response.data.currentPage;
      total = response.data.total;
    } else {
      return res.redirect('/exception/500');
    }

    response = await getNoReplyTopic();

    if (response.status === 1) {
      noReplyTopic = response.data;
    } else {
      return res.redirect('/exception/500');
    }

    return res.render('topic/search', {
      title: '搜索结果',
      topics,
      currentPage,
      totalPage,
      total,
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

    const response = await starOrUnstarTopic(tid);

    if (response.status === 1) {
      return res.send({
        status: 1,
        action: response.type
      });
    } else {
      return res.send({
        status: 0,
        message: response.message
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

    const response = await collectOrUncollectTopic(tid);

    if (response.status === 1) {
      return res.send({
        status: 1,
        action: response.type
      });
    } else {
      return res.send({
        status: 0,
        message: response.message
      });
    }
  }
}

module.exports = new Topic();
