class Exception {
  render403(req, res) {
    return res.status(403).render('exception/403', {
      title: '403'
    });
  }

  render404(req, res) {
    return res.status(404).render('exception/404', {
      title: '404'
    });
  }

  render500(req, res) {
    return res.status(500).render('exception/500', {
      title: '500'
    });
  }
}

module.exports = new Exception();
