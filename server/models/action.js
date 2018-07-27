const mongoose = require('mongoose');
const Plugin = require('./plugin');

const { Schema } = mongoose;
const { ObjectId } = Schema;

/*
* 根据类型区分行为 type
* 1. create 创建了
* 2. star 喜欢了
* 3. collect 收藏了
* 4. follow 关注了
*/

const ActionSchema = new Schema({
  type: { type: String, required: true },

  author_id: { type: ObjectId, required: true }, // 发起者
  target_id: { type: ObjectId, required: true }, // 命中者

  is_un: { type: Boolean, default: false }, // 行为反向

  create_at: { type: Date, default: Date.now },
  update_at: { type: Date, default: Date.now }
});

ActionSchema.plugin(Plugin);

ActionSchema.index({ type: 1, author_id: 1, target_id: 1 }, { unique: true });
ActionSchema.index({ author_id: 1, create_at: -1 });

ActionSchema.virtual('actualType').get(function() {
  return this.is_un ? `un_${this.type}` : this.type;
});

const Action = mongoose.model('Action', ActionSchema);

module.exports = Action;
