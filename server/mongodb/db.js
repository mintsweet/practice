import mongoose from 'mongoose';
import config from '../config';

mongoose.connect(config.mongodb);

const db = mongoose.connection;

db.on('connected', () => {
  console.log(`MongoDB Connection Success!`);
});

db.on('error', (err) => {
  console.error(`MongoDB Connection Error: ${err}`);
});

db.on('disconnected', () => {
  console.error(`MongoDB Connection Failed!`);
});

export default db;