const moment = require('moment');

module.exports = function(schema) {
  schema.methods.create_at_ago = function() {
    return moment(this.create_at).fromNow();
  };

  /* eslint-disable no-multi-assign */
  schema.options.toObject = schema.options.toJSON = {
    transform(doc, ret) {
      ret.id = ret._id;
      ret.create_at = moment(ret.create_at).format('YYYY-MM-DD HH:mm');
    }
  };
};
