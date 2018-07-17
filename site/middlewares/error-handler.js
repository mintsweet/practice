class ErrorHandler {
  /* eslint-disable no-unused-vars */ 
  handleError(err, req, res, next) {
    console.log(err);

    res.render('exception/error', {
      title: err.message,
      err
    });
  }
}

module.exports = new ErrorHandler();
