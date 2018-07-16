class ErrorHandler {
  errorHandler(err, req, res) {
    // console.log('啦啦啦');
    console.log(err);
    // console.log(err);

    // console.log(req);

    // console.log(res);

    // res.render('exception/500', {
    //   title: '500'
    // });
  }

  error404(req, res) {
    res.status(404).render('exception/404', {
      title: '404'
    });
  }

  error500(err, req, res) {
    if (err) {
      console.error(err.message);
    }

    res.status(500).render('exception/500', {
      title: '500'
    });
  }
}

module.exports = new ErrorHandler();
