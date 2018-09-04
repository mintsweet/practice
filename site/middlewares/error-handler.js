/* eslint-disable no-unused-vars */
class ErrorHandler {
  handle404(req, res, next) {
    return res.render('exception/404', {
      title: '404'
    });
  }

  handle500(err, req, res, next) {
    return res.render('exception/500', {
      title: '500',
      error: err.message
    });
  }
}

module.exports = new ErrorHandler();
