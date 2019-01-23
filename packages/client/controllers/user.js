class User {
  renderSignup(req, res) {
    res.render('pages/user/signup', {
      title: '注册'
    });
  }

  renderSignin(req, res) {
    res.render('pages/user/signin', {
      title: '登录'
    });
  }
}

module.exports = new User();
