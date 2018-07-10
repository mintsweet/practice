/*
* Mints - app.js
*/
const chalk = require('chalk');
const express = require('express');
const path = require('path');
const config = require('../config.default');
const routes = require('./router');
const Auth = require('./middlewares/auth');
const ErrorHandler = require('./middlewares/error-handler');

const app = express();

// views
app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'pug');

// static
app.use('/static', express.static(path.join(__dirname, 'dist')));

// local
app.locals.config = config;

// middleware
app.use(Auth.getUserInfo);

// routes
app.use('/', routes);

// error
app.use(ErrorHandler.error404);
app.use(ErrorHandler.error500);

if (!module.parent) {
  app.listen(config.site_port, () => {
    console.log(`Mints PC Client listening on ${chalk.greenBright(`http://localhost:${config.site_port}`)}`);
  });
}

module.exports = app;
