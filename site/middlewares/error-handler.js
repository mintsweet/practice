class ErrorHandler {
  error404(req, res) {
    res.status(404).render('exception/404', { title: '404' });
  }

  error500(err, req, res) {
    if (err) {
      console.error(err.stack);
    }
    res.status(500).render('exception/500', { title: '500' });
  }
}

module.exports = new ErrorHandler();
