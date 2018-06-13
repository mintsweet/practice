const formidable = require('formidable');
const { apiSignin } = require('../http/api');

class User {
  // 登录页
  renderSignin(req, res) {
    res.render('user/signin', {
      title: '登录'
    });
  }
  
  // 登录
  signin(req, res) {
    const form = new formidable.IncomingForm();
    form.parse(req, async (err, fields, files) => {
      if (err) {
        return res.render('user/signin', {
          title: '登录',
          error: err
        });
      }

      const response = await apiSignin(Object.assign({ type: 'acc' }, fields));

      if (response.status === 1) {
        return res.redirect('/')
      } else {
        return res.render('user/signin', {
          title: '登录',
          error: response.message
        });
      }
    });
  }
}

module.exports = new User();