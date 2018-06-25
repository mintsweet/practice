const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const LikeSchema = new Schema({
  user_id: { type: ObjectId },
  topic_id: { type: ObjectId },
  create_at: { type: Date, default: Date.now }
});

LikeSchema.index({ id: -1 });

const Like = mongoose.model('Like', LikeSchema);

module.exports = Like;