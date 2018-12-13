module.exports = function(schema) {
  schema.options.toObject = schema.options.toJSON = {
    transform(doc, ret) {
      ret.id = ret._id;
      delete ret.__v;
      delete ret._id;
    }
  };
};
