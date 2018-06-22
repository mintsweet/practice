const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ReplySchema = new Schema({
  id: { unqie: true, type: Number, isRequire: true },
  content: { type: String, isRequire: true },
  topic_id: { type: Number, isRequire: true },
  author_id: { type: Number, isRequire: true },
  reply_id: { type: Number },
  create_at: { type: Date, default: Date.now },
  update_at: { type: Date, default: Date.now },
  ups: { type: Array, default: [] }
});

ReplySchema.index({ id: -1 });
ReplySchema.index({ topic_id: 1 });
ReplySchema.index({ author_id: 1, create_at: -1 });

const Reply = mongoose.model('Reply', ReplySchema);

module.exports = Reply;