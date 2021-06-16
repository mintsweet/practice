const redis = require('redis');
const { promisify } = require('util');
const logger = require('../utils/logger');
const {
  redis: { HOST, PORT, DB, PASSWORD },
} = require('../../../config');

const client = redis.createClient({
  host: HOST,
  port: PORT,
  db: DB,
  password: PASSWORD,
});

client.on('error', err => {
  logger.error(`Redis connection error: ${err}!`);
  process.exit(1);
});

const set = promisify(client.set).bind(client);
const get = promisify(client.get).bind(client);

module.exports = {
  set,
  get,
};
