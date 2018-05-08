import mongoose from 'mongoose';
import moment from 'moment';
import GenerData from '../mock/gener';

const Schema = mongoose.Schema;

const GenerSchema = new Schema({
  id: {
    unqie: true,
    type: Number,
    isRequire: true
  },
  name: {
    type: String,
    isRequire: true
  },
  post_list: {
    type: Array,
    default: []
  },
  create_at: {
    type: String,
    default: moment(Date.now()).format('YYYY-MM-DD')
  }
});

GenerSchema.index({ id: 1 });

const Gener = mongoose.Model('Gener', GenerSchema);

Gener.findOne((err, data) => {
  if (!data) {
    GenerData.map(async item => {
      const _gener = new Gener(item);
      await _gener.save();
    });
  }
});

export default Post;