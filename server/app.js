const Express = require('express');
const mongoose = require('mongoose');
const connectMongo = require('connect-mongo');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const logger = require('./utils/logger');
const config = require('../config.default');
const router = require('./router');
const errorHandler = require('./middleware/error-handler');

// init
const app = new Express();
const env = process.env.NODE_ENV || 'development';

// connect mongodb
const dbpath = env === 'test' ? 'mongodb://localhost/practice-test' : config.db;
mongoose.connect(dbpath, error => {
  if (error) {
    logger.error('MongoDB Connection Error: ', error);
    process.exit(1);
  } else {
    logger.info('MongoDB Connection Success!');
  }
});


// cookie and session
const MongoStore = connectMongo(session);
app.use(cookieParser(config.session_secret));
app.use(session({
  name: 'practice',
  secret: config.session_secret,
  resave: true,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: false,
    maxAge: 2592000000,
  },
  store: new MongoStore({
    url: dbpath
  })
}));

// cross and interceptor
const ALLOW_ORIGIN = [
  'localhost:3000',
  'http://localhost:3001'
];

app.all('*', (req, res, next) => {
  const reqOrigin = req.headers.origin || req.headers.host;
  console.log(reqOrigin);

  if (ALLOW_ORIGIN.includes(reqOrigin) || env === 'test') {
    res.header('Access-Control-Allow-Origin', reqOrigin);
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
    res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Credentials', true);
    res.header('X-Powered-By', '3.2.1');
    if (req.method === 'OPTIONS') {
      res.sendStatus(200);
    } else {
      next();
    }
  } else {
    res.send({
      status: 0,
      type: 'ILLEGAL DOMAIN NAME',
      message: '非法的域名'
    });
  }
});

// router
app.use('/api', router);

// error handle
app.use(errorHandler.error404);
app.use(errorHandler.error500);

if (!module.parent) {
  app.listen(config.server_port, () => {
    logger.info('The Server listening on port', config.server_port);
    logger.info('');
  });
}

module.exports = app;
