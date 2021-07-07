const API = require('../utils/api');

module.exports = () => {
  return async (req, _, next) => {
    if (!req.session.token) {
      return next();
    }

    if (req.app.locals.user && req.app.locals.user.id) {
      return next();
    }

    const user = await API.getCurrentUser(req.session.token);
    req.app.locals.user = user;

    next();
  };
};
