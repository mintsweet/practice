/*
* Mints - app.js
*/
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const config = require('../config.default');
const routes = require('./router');
const Auth = require('./middlewares/auth');
const ErrorHandler = require('./middlewares/error-handler');

const app = module.exports = express();

// views
app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'pug');

// static
app.use('/static', express.static(path.join(__dirname, 'dist')));

// local
app.locals.config = config;

// middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(Auth.getUserInfo);

// routes
app.use('/', routes);
app.use(ErrorHandler.handle404);
app.use(ErrorHandler.handle500);

if (!module.parent) app.listen(config.site_port);
