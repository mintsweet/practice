import mongoose from 'mongoose';
import moment from 'moment';
import MoodData from '../mock/mood';

const Schema = mongoose.Schema;

const MoodSchema = new Schema({
  id: {
    unqie: true,
    type: Number,
    isRequire: true
  },
  content: {
    type: String,
    isRequire: true
  },
  author_id: {
    type: Number,
    isRequire: true
  },
  praise_list: {
    type: Array,
    default: []
  },
  comment: {
    type: Array,
    default: []
  },
  create_at: {
    type: String,
    default: moment(Date.now()).format('YYYY-MM-DD HH:mm:ss')
  }
});

MoodSchema.index({ id: 1 });

const Mood = mongoose.Model('Mood', MoodSchema);

Mood.findOne((err, data) => {
  if (!data) {
    MoodData.map(async item => {
      const _mood = new Gener(item);
      await _mood.save();
    });
  }
});

export default Post;