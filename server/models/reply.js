const mongoose = require('mongoose');
const Plugin = require('./plugin');

const { Schema } = mongoose;
const { ObjectId } = Schema;

const ReplySchema = new Schema({
  content: { type: String, required: true },

  topic_id: { type: ObjectId, required: true },
  author_id: { type: ObjectId, required: true },
  reply_id: { type: ObjectId },

  create_at: { type: Date, default: Date.now },
  update_at: { type: Date, default: Date.now },

  ups: { type: Array, default: [] }
});

ReplySchema.plugin(Plugin);

ReplySchema.index({ topic_id: 1, author_id: 1 });
ReplySchema.index({ author_id: 1, create_at: -1 });

ReplySchema.pre('save', function(next) {
  this.update_at = new Date();
  next();
});

const Reply = mongoose.model('Reply', ReplySchema);

module.exports = Reply;
