const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const CollectSchema = new Schema({
  user_id: { type: ObjectId },
  topic_id: { type: ObjectId },

  create_at: { type: Date, default: Date.now }
});

CollectSchema.index({ user_id: 1, topic_id: 1 }, { unique: true });

const Collect = mongoose.model('Collect', CollectSchema);

module.exports = Collect;