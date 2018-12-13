const mongoose = require('mongoose');
const logger = require('./utils/logger');
const config = require('./config');

// connect mongodb
const dbpath = process.env.NODE_ENV === 'test' ? config.mongodb.test : config.mongodb.dev;

mongoose.set('useCreateIndex', true);
mongoose.connect(dbpath, { useNewUrlParser: true });

const db = mongoose.connection;

db.on('error', err => {
  logger.error(`MongoDB connection error: ${err}!`);
  process.exit(1);
});

db.once('open', function() {
  logger.info('MongoDB connection success!');
});
