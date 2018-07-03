const moment = require('moment');

module.exports = function(schema) {
  schema.methods.create_at_ago = function() {
    return moment(this.create_at).format('YYYY-MM-DD HH:mm');
  };

  schema.methods.update_at_ago = function() {
    return moment(this.update_at).format('YYYY-MM-DD HH:mm');
  };

  if (!schema.options.toObject) {
    schema.options.toObject = {};
  }

  schema.options.toObject.transform = function(doc, ret) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
  };
};
