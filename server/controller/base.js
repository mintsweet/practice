const qiniu = require('qiniu');
const BehaviorModel = require('../models/behavior');
const NoticeModel = require('../models/notice');
const config = require('../../config.default');

module.exports = class Base {
  // 创建或者改变一个行为
  async generateBehavior(action, author_id, target_id) {
    let behavior;
    behavior = await BehaviorModel.findOne({ action, author_id, target_id });
    if (behavior) {
      behavior.is_un = !behavior.is_un;
      await behavior.save();
    } else {
      behavior = await BehaviorModel.create({ action, author_id, target_id });
    }
    return behavior;
  }

  // 谁(author_id)喜欢了你(target_id)的话题(topic_id)
  async sendStarNotice(author_id, target_id, topic_id) {
    await NoticeModel.findOneAndUpdate({ type: 'star', author_id, target_id, topic_id }, {
      has_read: false,
      create_at: Date.now()
    }, {
      upsert: true
    });
  }

  // 谁(author_id)收藏了你(target_id)的话题(topic_id)
  async sendCollectNotice(author_id, target_id, topic_id) {
    await NoticeModel.findOneAndUpdate({ type: 'collect', author_id, target_id, topic_id }, {
      has_read: false,
      create_at: Date.now()
    }, {
      upsert: true
    });
  }

  // 谁(author_id)回复了你(target_id)的话题(topic_id)
  async sendReplyNotice(author_id, target_id, topic_id) {
    await NoticeModel.create({ type: 'reply', author_id, target_id, topic_id });
  }

  // 谁(author_id)回复了你(target_id)在话题(topic_id)中的回复(reply_id)
  async sendReply2Notice(author_id, target_id, topic_id, reply_id) {
    await NoticeModel.create({ type: 'reply2', author_id, target_id, topic_id, reply_id });
  }

  // 谁(author_id)关注了你(target_id)
  async sendFollowNotice(author_id, target_id) {
    await NoticeModel.findOneAndUpdate({ type: 'follow', author_id, target_id }, {
      has_read: false,
      create_at: Date.now()
    }, {
      upsert: true
    });
  }

  // 谁(author_id)点赞了你(target_id)的回复(reply_id)
  async sendUpsNotice(author_id, target_id, reply_id) {
    await NoticeModel.create({ type: 'ups', author_id, target_id, reply_id });
  }

  // 七牛图片上传
  async uploadImg(name, path) {
    const mac = new qiniu.auth.digest.Mac(config.qiniu.ACCESS_KEY, config.qiniu.SECRET_KEY);
    const putPolicy = new qiniu.rs.PutPolicy({
      scope: `${config.qiniu.BUCKET_NAME}:${name}`
    });

    const uploadToken = putPolicy.uploadToken(mac);
    const qiniuConfig = new qiniu.conf.Config();
    // 空间对应机房
    // 华东:qiniu.zone.Zone_z0
    // 华北:qiniu.zone.Zone_z1
    // 华南:qiniu.zone.Zone_z2
    // 北美:qiniu.zone.Zone_na0
    qiniuConfig.zone = qiniu.zone.Zone_z0;

    const formUploader = new qiniu.form_up.FormUploader(qiniuConfig);
    const putExtra = new qiniu.form_up.PutExtra();
    // 文件上传
    return new Promise((resolve, reject) => {
      formUploader.putFile(uploadToken, name, path, putExtra, function(err, body, res) {
        if (err) {
          return reject(err);
        }
        if (res.statusCode === 200) {
          const url = `${config.qiniu.DONAME}/${body.key}}?date=${Date.now()}`;
          return resolve(url);
        } else {
          return reject(err);
        }
      });
    });
  }
};
