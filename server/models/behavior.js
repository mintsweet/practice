const mongoose = require('mongoose');
const { Schema } = mongoose;
const { ObjectId } = Schema;
const BaseModel = require('./base');

/*
* 根据类型区分行为 type
* 1. create 创建了
* 2. star 喜欢了
* 3. collect 收藏了
* 4. follow 关注了
* 5. reply 回复了话题
* 6. reply2 回复了回复
* 7. up 点赞了
*/

const BehaviorSchema = new Schema({
  type: { type: String, required: true },

  author_id: { type: ObjectId, required: true }, // 发起者
  target_id: { type: ObjectId, required: true }, // 命中者

  is_un: { type: Boolean, default: false }, // 行为反向

  create_at: { type: Date, default: Date.now }
});

BehaviorSchema.plugin(BaseModel);

BehaviorSchema.index({ type: 1, author_id: 1, target_id: 1 }, { unique: true });
BehaviorSchema.index({ create_at: -1 });

BehaviorSchema.virtual('actualType').get(function() {
  return this.is_un ? `un_${this.type}` : this.type;
});

const Behavior = mongoose.model('Behavior', BehaviorSchema);

module.exports = Behavior;
