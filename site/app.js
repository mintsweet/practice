/*
* Mints - app.js
*/
const chalk = require('chalk');
const express = require('express');
const path = require('path');
const config = require('../config.default');
const routes = require('./router');
const Auth = require('./middleware/auth');

const app = express();

// views
app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'pug');

// static
app.use('/static', express.static(path.join(__dirname, 'public')));

// local
app.locals.config = config;

// middleware
app.use(Auth.getUserInfo);

// routes
app.use('/', routes);

// 404
app.use(function (req, res) {
  res.status(404).render('exception/404', { title: '404' });
});

// 500
app.use((err, req, res) => {
  if (err) {
    console.error(err.message);
  }
  res.status(500).render('exception/500', { title: '500' });
});

if (!module.parent) {
  app.listen(config.site_port, () => {
    console.log(`Mints PC Client listening on ${chalk.greenBright(`http://localhost:${config.site_port}`)}`);
  });
}
