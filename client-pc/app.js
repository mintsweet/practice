/*
* Mints - app.js
*/
const express = require('express');
const path = require('path');
const config = require('./config');
const logger = require('./utils/logger');
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
  app.listen(config.port, () => {
    logger.info('Mints listening on port', config.port);
    logger.info('You can debug your app with http://' + config.hostname + ':' + config.port);
    logger.info('');
  });
}