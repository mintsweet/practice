const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const routes = require('./router');
const config = require('../../config');
const errorHandler = require('./middleware/error-handler');
const user = require('./middleware/user');

const app = (module.exports = express());

// view
app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'pug');

// static
app.use('/static', express.static(path.join(__dirname, 'dist')));

// config
app.locals.config = config;

// middleware
app.use(bodyParser.urlencoded({ limit: '50mb', extended: false }));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(
  session({
    secret: config.session.SECRET,
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({
      url: config.DB_PATH,
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 3,
      },
    }),
  }),
);
app.use(user());

// router
app.use('/', routes);
app.use(errorHandler.handle404);
app.use(errorHandler.handle500);

if (!module.parent) app.listen(config.CLIENT_PORT);
