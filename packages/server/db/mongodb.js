const mongoose = require('mongoose');
const logger = require('../utils/logger');
const { DB_PATH } = require('../config');

mongoose.set('useCreateIndex', true);
mongoose.connect(DB_PATH, { useNewUrlParser: true });

const db = mongoose.connection;

db.on('error', err => {
  logger.error(`MongoDB connection error: ${err}!`);
  process.exit(1);
});
