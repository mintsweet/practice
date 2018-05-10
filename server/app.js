const chalk = require('chalk');
const Express = require('express');
const mongoose = require('mongoose');
const connectMongo = require('connect-mongo');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const config = require('./config');
const router = require('./routes');

/*
* init express
*/
const app = new Express();

/*
* connect mongodb
*/
mongoose.connect(config.mongodb, {
    server: {poolSize: 20}
}, (err) => {
  console.error(chalk.redBright(`MongoDB Connection Error: ${err}`));
  process.exit(1);
});

/*
* cross
*/
const ALLOW_ORIGIN = [
  'http://localhost:3001',
  'http://localhost:3002',
  'http://localhost:3003',
  'http://localhost:3004'
];

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

const MongoStore = connectMongo(session);
app.use(cookieParser());
app.use(session({
  name: config.session.key,
  secret: config.session.secret,
  resave: true,
  saveUninitialized: false,
  cookie: config.session.cookie,
  store: new MongoStore({
    url: config.mongodb
  })
}));

router(app);

app.listen(config.port, () => {
  console.log(chalk.greenBright(`Server start on ${config.port}!`));
});