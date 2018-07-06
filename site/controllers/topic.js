const formidable = require('formidable');
const { createTopic, getTopicDetail, likeOrUnlikeTopic, getTopicBySearch, getNoReplyTopic } = require('../http/api');

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
        return res.redirect('/');
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

    const response = await getTopicDetail(tid);

    if (response.status === 1) {
      return res.render('topic/detail', {
        title: '话题详情',
        topic: response.data
      });
    } else {
      return res.redirect('/exception/500');
    }
  }

  // 喜欢或者取消喜欢
  async likeOrUnlikeTopic(req, res) {
    const { tid } = req.params;
    const { user } = req.app.locals;

    if (!user) {
      return res.send({
        status: 0,
        message: '尚未登录'
      });
    }

    const response = await likeOrUnlikeTopic(tid);

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

  // 搜索结果页
  async renderSearch(req, res) {
    const { q } = req.query;

    let response;
    let topics;
    let currentPage;
    let totalPage;
    let total;
    let noReplyList;

    response = await getTopicBySearch({ title: q });

    if (response.status === 1) {
      // topics = response.data.topics;
      // currentPage = response.data.currentPage;
      totalPage = response.data.currentPage;
      // total = response.data.total;
    } else {
      return res.redirect('/exception/500');
    }

    response = await getNoReplyTopic();

    if (response.status === 1) {
      noReplyList = response.data;
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
      noReplyList
    });
  }
}

module.exports = new Topic();
