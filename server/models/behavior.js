const mongoose = require('mongoose');
const { Schema } = mongoose;
const { ObjectId } = Schema;
const BaseModel = require('./base');

/*
* 根据类型区分行为 action
* 1. create 创建了
* 2. star 喜欢了
* 3. collect 收藏了
* 4. follow 关注了
* 5. reply 回复了
* 6. reply2 回复了回复
* 7. up 点赞了
*/

const BehaviorSchema = new Schema({
  action: { type: String, required: true },

  author_id: { type: ObjectId, required: true }, // 发起者
  target_id: { type: ObjectId, required: true }, // 命中者

  is_un: { type: Boolean, default: false }, // 行为反向

  create_at: { type: Date, default: Date.now },
  update_at: { type: Date, default: Date.now }
});

BehaviorSchema.plugin(BaseModel);

BehaviorSchema.index({ action: 1, author_id: 1, target_id: 1 }, { unique: true });
BehaviorSchema.index({ author_id: 1, create_at: -1 });

BehaviorSchema.virtual('actualAction').get(function() {
  return this.is_un ? `un_${this.action}` : this.action;
});

const Behavior = mongoose.model('Behavior', BehaviorSchema);

module.exports = Behavior;
