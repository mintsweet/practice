const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MessageSchema = new Schema({
  id: { unqie: true, type: Number, isRequire: true },
  type: { type: String, isRequire: true },
  master_id: { type: Number, isRequire: true },
  author_id: { type: Number, isRequire: true },
  has_read: { type: Boolean, default: false },
  create_at: { type: Date, default: Date.now }
});

MessageSchema.index({ id: -1 });

const Message = mongoose.model('Message', MessageSchema);

module.exports = Message;
