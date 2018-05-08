const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const IdsSchema = new Schema({
  admin_id: Number,
  user_id: Number,
  genre_id: Number,
  post_id: Number,
  mood_id: Number
});

const Ids = mongoose.model('Ids', IdsSchema);

Ids.findOne((err, data) => {
  const newIds = new Ids({
    admin_id: 11,
    user_id: 11,
    genre_id: 11,
    post_id: 11,
    mood_id: 11
  });
  newIds.save();
});

module.exports = Ids;