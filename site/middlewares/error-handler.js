/* eslint-disable no-unused-vars */ 
class ErrorHandler {
  handle404(req, res, next) {
    return res.redirect(301, '/exception/404');
  }

  handleError(err, req, res, next) {
    return res.render('exception/unkown', {
      title: '未知的错误',
      error: err.message
    });
  }
}

module.exports = new ErrorHandler();
