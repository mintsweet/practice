/*
* Mints - app.js
*/
const express = require('express');
const path = require('path');
const config = require('../config.default');
const routes = require('./router');

const app = express();

// views
app.set('views', path.join(__dirname, './views/pages'));
app.set('view engine', 'pug');

// static
app.use('/static', express.static(path.join(__dirname, 'public')));

// local
app.locals.config = config;

// routes
app.use('/', routes);

if (!module.parent) {
  app.listen(config.client_pc_port, () => {
    console.log('Mints PC Client listening on port', config.client_pc_port);
  });
}