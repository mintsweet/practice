/*
* Mints - app.js
*/
const chalk = require('chalk');
const express = require('express');
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

// middleware

// routes
app.use('/', routes);

// 404
app.use(function (req, res, next) {
  res.status(404).render('exception/404', { title: '404' });
});

// 500
app.use((err, req, res) => {
  res.status(500).render('exception/500', { title: '500' });
});

if (!module.parent) {
  app.listen(config.site_port, () => {
    console.log(`Mints PC Client listening on ${chalk.greenBright(`http://localhost:${config.site_port}`)}`);
  });
}