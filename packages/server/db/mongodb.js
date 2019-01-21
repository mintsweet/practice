const mongoose = require('mongoose');
const logger = require('../utils/logger');
const { dbpath } = require('../config');

mongoose.set('useCreateIndex', true);
mongoose.connect(dbpath, { useNewUrlParser: true });

const db = mongoose.connection;

db.on('error', err => {
  logger.error(`MongoDB connection error: ${err}!`);
  process.exit(1);
});
