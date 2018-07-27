const Express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const RedisStore = require('connect-redis')(session);
const config = require('../config.default');
const router = require('./router');
const handleError = require('./middlewares/error-handler');

// connect db
require('./db');

const app = module.exports = new Express();

// middleware
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// cookie and session
app.use(cookieParser(config.session_secret));
app.use(session({
  store: new RedisStore(),
  name: 'practice',
  secret: config.session_secret,
  resave: true,
  saveUninitialized: false
}));

// router
app.use('/v1', router);

// 404
app.use((req, res) => {
  return res.send({
    status: 0,
    message: '找不到请求资源'
  });
});

// error handle
app.use(handleError);

if (!module.parent) app.listen(config.server_port);
