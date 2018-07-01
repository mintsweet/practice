const Express = require('express');
const mongoose = require('mongoose');
const connectMongo = require('connect-mongo');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const logger = require('./utils/logger');
const config = require('../config.default');
const router = require('./router');

// init
const app = new Express();

// connect mongodb
mongoose.connect(config.db, error => {
  if (error) {
    logger.error('MongoDB Connection Error: ', error);
    process.exit(1);
  } else {
    logger.info('MongoDB Connection Success!');
  }
});


// // cross and interceptor
// const ALLOW_ORIGIN = [
//   'http://localhost:3001',
//   'http://localhost:3002',
//   'http://localhost:3003',
//   'http://localhost:3004'
// ];

// app.all('*', (req, res, next) => {
//   const reqOrigin = req.headers.origin;
//   if (ALLOW_ORIGIN.includes(reqOrigin)) {
//     res.header("Access-Control-Allow-Origin", reqOrigin);
//     res.header("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With");
//     res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
//     res.header("Access-Control-Allow-Credentials", true);
//     res.header("X-Powered-By", '3.2.1');
//     if (req.method == 'OPTIONS') {
//       res.sendStatus(200);
//     } else {
//       next();
//     }
//   } else {
//     res.send({
//       status: 0,
//       type: 'ILLEGAL DOMAIN NAME',
//       message: '非法的域名'
//     });
//   }
// });

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
    url: config.db
  })
}));

// router
app.use('/api', router);

// 404
app.use((req, res) => {
  res.status(404).send({
    status: 0,
    type: 'ERROR_NOT_FIND_THAT',
    message: '找不到请求资源'
  });
});

// 500
app.use((err, req, res) => {
  logger.error(err);
  res.status(500).send({
    status: 0,
    type: 'ERROR_SERVICE',
    message: '服务器无响应，请稍后重试'
  });
});

if (!module.parent) {
  app.listen(config.server_port, () => {
    logger.info('The Server listening on port', config.server_port);
    logger.info('');
  });
}

module.exports = app;
