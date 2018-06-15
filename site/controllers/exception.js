class Exception {
  // 403
  render403(req, res) {
    res.render('exception/403', {
      title: '403'
    });
  }

  render500(req, res) {
    res.render('exception/500', {
      title: '500'
    });
  }
}

module.exports = new Exception();