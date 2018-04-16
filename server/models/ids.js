import mongoose from 'mongoose';

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
    admin_id: 1,
    user_id: 1,
    genre_id: 1,
    post_id: 1,
    mood_id: 1
  });
  newIds.save();
});

export default Ids;