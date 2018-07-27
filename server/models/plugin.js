const moment = require('moment');
require('moment/locale/zh-cn.js');

module.exports = function(schema) {
  schema.methods.create_at_ago = function() {
    return moment(this.create_at).toNow();
  };

  schema.methods.last_reply_at_ago = function() {
    return moment(this.last_reply_at).toNow();
  };

  schema.options.toObject = schema.options.toJSON = {
    transform(doc, ret) {
      ret.id = ret._id;
      delete ret.__v;
      delete ret._id;
    }
  };
};
