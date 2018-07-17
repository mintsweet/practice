class ErrorHandler {
  /* eslint-disable no-unused-vars */ 
  handleError(err, req, res, next) {
    res.render('exception/error', {
      title: err.message,
      err
    });
  }
}

module.exports = new ErrorHandler();
