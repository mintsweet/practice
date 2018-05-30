const rq = require('request-promise');

class User {
  renderSignin(req, res) {
    res.render('signin', {
      title: '用户登录'
    });
  }
}

module.exports = new User();