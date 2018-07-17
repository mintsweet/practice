const mongoose = require('mongoose');
const { Schema } = mongoose;
const { ObjectId } = Schema;
const BaseModel = require('./base');

/*
* 根据类型区分消息 type
* 1. system 系统
* 2. star 喜欢话题
* 3. collect 收藏话题
* 4. follow 关注用户
* 5. reply 回复话题
* 6. reply2 回复评论
* 7. up 点赞回复
*/

const NoticeSchema = new Schema({
  type: { type: String, required: true },

  target_id: { type: ObjectId, required: true },
  author_id: { type: ObjectId },
  topic_id: { type: ObjectId },
  reply_id: { type: ObjectId },

  content: { type: String },

  create_at: { type: Date, default: Date.now },
  update_at: { type: Date, default: Date.now }
});

NoticeSchema.plugin(BaseModel);

NoticeSchema.index({ target_id: 1, create_at: -1 });
NoticeSchema.index({ author_id: 1, create_at: -1 });

NoticeSchema.virtual('typeName').get(function() {
  let typeName = '';

  switch (this.type) {
    case 'star':
      typeName = '喜欢了';
      break;
    case 'collect':
      typeName = '收藏了';
      break;
    case 'follow':
      typeName = '新的关注者';
      break;
    case 'reply':
    case 'reply2':
      typeName = '回复了';
      break;
    case 'up':
      typeName = '点赞了';
      break;
    default:
      typeName = '';
      break;
  }

  return typeName;
});

const Notice = mongoose.model('Notice', NoticeSchema);

module.exports = Notice;
