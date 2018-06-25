const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const ReplySchema = new Schema({
  content: { type: String },

  topic_id: { type: ObjectId },
  author_id: { type: ObjectId },
  reply_id: { type: ObjectId },

  create_at: { type: Date, default: Date.now },
  update_at: { type: Date, default: Date.now },

  ups: { type: Array, default: [] }
});

ReplySchema.index({ topic_id: 1 });
ReplySchema.index({ author_id: 1, create_at: -1 });

const Reply = mongoose.model('Reply', ReplySchema);

module.exports = Reply;