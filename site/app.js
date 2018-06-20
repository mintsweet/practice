/*
* Mints - app.js
*/
const express = require('express');
const chalk = require('chalk');
const path = require('path');
const config = require('../config.default');
const routes = require('./router');
const { getCurrentUser } = require('./http/api');

const app = express();

// views
app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'pug');

// static
app.use('/static', express.static(path.join(__dirname, 'public')));

// local
app.locals.config = config;
app.locals.msg_code = {};
app.locals.pic_token = {};
app.use(async (req, res, next) => {
  const response = await getCurrentUser();
  if (response.status === 1) {
    app.locals.user = response.data;
  } else {
    app.locals.user = null;
  }
  next();
});

// routes
app.use('/', routes);

if (!module.parent) {
  app.listen(config.site_port, () => {
    console.log(`Mints PC Client listening on ${chalk.greenBright(`http://localhost:${config.site_port}`)}`);
  });
}