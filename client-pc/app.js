/*
* Mints - app.js
*/
const express = require('express');
const config = require('./config');
const logger = require('./utils/logger');
const routes = require('./router');

const app = express();

// routes
app.use('/', routes);

if (!module.parent) {
  app.listen(config.port, () => {
    logger.info('NodeClub listening on port', config.port);
    logger.info('God bless love....');
    logger.info('You can debug your app with http://' + config.hostname + ':' + config.port);
    logger.info('');
  });
}