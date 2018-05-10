const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const IdsSchema = new Schema({
  message_id: { type: Number },
  reply_id: { type: Number },
  topic_id: { type: Number },
  user_id: { type: Number },
  statistics_id: { type: Number }
});

const Ids = mongoose.model('Ids', IdsSchema);

module.exports = Ids;