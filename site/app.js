/*
* Mints - app.js
*/
const express = require('express');
const chalk = require('chalk');
const path = require('path');
const config = require('../config.default');
const routes = require('./router');

const app = express();

// views
app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'pug');

// static
app.use('/static', express.static(path.join(__dirname, 'public')));

// local
app.locals.config = config;

// routes
app.use('/', routes);

if (!module.parent) {
  app.listen(config.site_port, () => {
    console.log(`Mints PC Client listening on ${chalk.greenBright(`http://localhost:${config.site_port}`)}`);
  });
}