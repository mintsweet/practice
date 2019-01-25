const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const routes = require('./router');
const config = require('./config');

const app = module.exports = express();

// view
app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'pug');

// static
app.use('/static', express.static(path.join(__dirname, 'dist')));

// config
app.locals.config = config;

// middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// router
app.use('/', routes);

if (!module.parent) app.listen(config.port);
