const mongoose = require('mongoose');
const redis = require('redis');
const { promisify } = require('util');
const logger = require('./utils/logger');
const config = require('../config.default');

// connect mongodb
const dbpath = process.env.NODE_ENV === 'test' ? 'mongodb://localhost:27017/practice-test' : config.mongodb;
mongoose.connect(dbpath, { useNewUrlParser: true });
const db = mongoose.connection;

db.on('error', err => {
  logger.error(`MongoDB Connection error: ${err}`);
  process.exit(1);
});

db.once('open', function() {
  logger.info('MongoDB connection success!');
});

// connect redis
const client = redis.createClient({
  db: 1
});

client.on('connect', () => {
  logger.info('Redis Connection Success!');
});

client.on('error', err => {
  logger.error(`Redis Connection Error: ${err}`);
  process.exit(1);
});

exports.setRedis = promisify(client.set).bind(client);
exports.getRedis = promisify(client.get).bind(client);
