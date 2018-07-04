const formidable = require('formidable');
const { createTopic, getTopicDetail } = require('../http/api');

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
}

module.exports = new Topic();
