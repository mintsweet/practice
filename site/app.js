/*
* Mints - app.js
*/
const express = require('express');
const path = require('path');
const config = require('../config.default');
const routes = require('./router');
const { apiGetUserInfo } = require('./service/api');

const app = express();

// views
app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'pug');

// static
app.use('/static', express.static(path.join(__dirname, 'public')));

// local
app.locals.config = config;

// middleware is login
app.use(async (req, res, next) => {
  if (app.locals.current_user) {
    return next();
  } else {
    const restRes = await apiGetUserInfo();
    if (restRes.status === 1) {
      app.locals.current_user = restRes.data;
      return next();
    } else {
      return next();
    }
  }
});

// routes
app.use('/', routes);

if (!module.parent) {
  app.listen(config.client_pc_port, () => {
    console.log('Mints PC Client listening on port', config.client_pc_port);
  });
}