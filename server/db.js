const mongoose = require('mongoose');
const logger = require('./utils/logger');
const config = require('../config.default');

// connect mongodb
const dbpath = process.env.NODE_ENV === 'test' ? 'mongodb://localhost:27017/practice-test' : config.mongodb;
mongoose.connect(dbpath, { useNewUrlParser: true });
const db = mongoose.connection;

db.on('error', () => logger.error('MongoDB Connection Error'));
