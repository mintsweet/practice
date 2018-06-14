const formidable = require('formidable');

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

      console.log(fields);
    });
  }
}

module.exports = new Site();