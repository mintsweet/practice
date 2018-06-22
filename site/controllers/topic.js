const formidable = require('formidable');
const { createTopic, getTopicDetail } = require('../http/api');

class Site {
  // 新增主题页
  renderCreate(req, res) {
    res.render('topic/create', {
      title: '发布主题'
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

  // 主题详情页
  async renderDetail(req, res) {
    const { id } = req.params;

    if (!id) {
      return res.render('exception/404', {
        title: '404'
      });
    }

    const response = await getTopicDetail(id);

    if (response.status === 1) {
      return res.render('topic/detail', {
        title: '主题详情'
      });
    } else {
      return res.render('exception/500', {
        title: '500'
      });
    }
  }

  // 编辑主题页
  renderEdit(req, res) {
    res.render('topic/edit', {
      title: '主题编辑'
    });
  }
}

module.exports = new Site();