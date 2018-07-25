const Express = require('express');
const cors = require('cors');
const connectMongo = require('connect-mongo');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const logger = require('./utils/logger');
const config = require('../config.default');
const router = require('./router');
const handleError = require('./middlewares/error-handler');

// connect db
require('./db');

const app = module.exports = new Express();

// middleware
app.use(cors());
app.use(handleError);

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
    url: process.env.NODE_ENV === 'test' ? 'mongodb://localhost/practice-test' : config.mongodb
  })
}));

// router
app.use('/api', router);

// 404
app.use((req, res) => {
  return res.send({
    status: 0,
    message: '找不到请求资源'
  });
});

if (!module.parent) app.listen(config.server_port, () => logger.info('Mints api service started successfully.'));
