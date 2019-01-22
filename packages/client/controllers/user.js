class User {
  renderSignup(req, res) {
    res.render('pages/signup', {
      title: '注册'
    });
  }

  renderSignin(req, res) {
    res.render('pages/signin', {
      title: '登录'
    });
  }
}

module.exports = new User();
