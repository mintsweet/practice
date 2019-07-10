const mongoose = require('mongoose');
const logger = require('../utils/logger');
const { DB_PATH } = require('../../../config');

const dbpath = process.env.NODE_ENV === 'test' ? 'mongodb://localhost:27017/p-test' : DB_PATH;

mongoose.set('useCreateIndex', true);
mongoose.connect(dbpath, { useNewUrlParser: true });

const db = mongoose.connection;

db.on('error', err => {
  logger.error(`MongoDB connection error: ${err}!`);
  process.exit(1);
});
