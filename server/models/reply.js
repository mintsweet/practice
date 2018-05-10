const mongoose = require('mongoose');
const moment = require('moment');

const Schema = mongoose.Schema;

/*
 * type:
 * reply: xx 回复了你的话题
 * follow: xx 关注了你
 * at: xx ＠了你
 */

const ReplySchema = new Schema({
  id: { unqie: true, type: Number, isRequire: true },
  content: { type: String, isRequire: true },
  topic_id: { type: Number,isRequire: true },
  author_id: { type: Number, isRequire: true },
  create_at: { type: Date, default: Date.now },
  update_at: { type: Date, default: Date.now },
  deleted: { type: Boolean,default: false }
});

ReplySchema.index({ topic_id: 1 });
ReplySchema.index({ author_id: 1, create_at: -1 });

const Reply = mongoose.model('Reply', ReplySchema);

module.exports = Reply;