const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const routes = require('./router');
const config = require('../../config');
const Auth = require('./middlewares/auth');
const ErrorHandler = require('./middlewares/error-handler');

const app = module.exports = express();

// view
app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'pug');

// static
app.use('/static', express.static(path.join(__dirname, 'dist')));

// config
app.locals.config = config;

// middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(session({
  secret: config.session.SECRET,
  resave: false,
  saveUninitialized: false,
  store: new MongoStore({
    url: config.DB_PATH,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 3
    },
  })
}));
app.use(Auth.validaUser);

// router
app.use('/', routes);
app.use(ErrorHandler.handle404);
app.use(ErrorHandler.handle500);

if (!module.parent) app.listen(config.CLIENT_PORT);
