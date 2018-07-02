const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

/*
* 根据类型区分行为 type
* 1. create 创建了
* 2. like 喜欢了
* 3. collect 收藏了
* 4. follow 关注了
* 5. ups 点赞了
*/

const BehaviorSchema = new Schema({
  type: { type: String, required: true },

  author_id: { type: ObjectId, required: true }, // 发起者
  target_id: { type: ObjectId, required: true }, // 命中者

  create_at: { type: Date, default: Date.now },

  delete: { type: Boolean, default: false }
});

BehaviorSchema.index({ type: 1, author_id: 1, target_id: 1 }, { unique: true });
BehaviorSchema.index({ create_at: -1 });

const Behavior = mongoose.model('Behavior', BehaviorSchema);

module.exports = Behavior;