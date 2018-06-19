const formidable = require('formidable');
const { getPicCaptcha, apiSignin, apiSignout, getCurrentUser } = require('../http/api');

class User {
  // 注册页
  async renderSignup(req, res) {
    const response = await getPicCaptcha();
    if (response.status === 1) {
      return res.render('user/signup', {
        title: '注册',
        url: response.data.url
      });
    }
  }

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
        return res.render('site/transfer', {
          title: '登录成功',
          text: '登录成功',
          type: 'success'
        });
      } else {
        return res.render('user/signin', {
          title: '登录',
          error: response.message
        });
      }
    });
  }

  // 登出
  async signout(req, res) {
    const response = await apiSignout();
    if (response.status === 1) {
      return res.render('site/transfer', {
        title: '退出成功',
        text: '退出成功',
        type: 'success'
      });
    }
  }

  // 个人信息页
  renderInfo(req, res) {
    return res.render('user/info', {
      title: '个人信息'
    });
  }
}

module.exports = new User();