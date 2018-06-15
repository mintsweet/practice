const formidable = require('formidable');
const { createTopic } = require('../http/api');

class Site {
  // 新增主题页
  async renderCreate(req, res) {
    res.render('topic/create', {
      title: '发布主题',
    });
  }
  
  // 新增主题
  createTopic(req, res) {
    const form = new formidable.IncomingForm();
    form.parse(req, async (err, fields, files) => {
      if (err) {
        return res.render('user/signin', {
          title: '发布主题',
          error: err
        });
      }

      const response = await createTopic(fields);

      if (response.status === 1) {
        return res.render('site/transfer', {
          title: '发布成功',
          text: '发布成功',
          type: 'success'
        });
      } else {
        return res.render('topic/create', {
          title: '发布主题',
          error: response.message
        });
      }
    });
  }
}

module.exports = new Site();