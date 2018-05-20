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

Ids.findOne((err, data) => {
  if (!data) {
    const newIds = new Ids({
      message_id: 1,
      reply_id: 1,
      topic_id: 1,
      user_id: 1,
      statistics_id: 1
    });
    newIds.save();
  }
});

module.exports = Ids;