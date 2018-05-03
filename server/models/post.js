import mongoose from 'mongoose';
import moment from 'moment';
import postData from '../mock/post';

const Schema = mongoose.Schema;

const PostSchema = new Schema({
  id: {
    unqie: true,
    type: Number,
    isRequire: true 
  },
  genre: {
    type: String,
    isRequire: true
  },
  title: {
    type: String,
    isRequire: true 
  },
  content: {
    type: String,
    isRequire: true
  },
  praise_num: {
    type: Number,
    default: 0 
  },
  comment_list: {
    type: Array,
    default: []
  },
  author_id: {
    type: Number,
    isRequire: true
  },
  create_at: {
    type: String,
    default: moment(Date.now()).format('YYYY-MM-DD')
  },
  update_at: {
    type: String
  }
});

PostSchema.index({ id: 1 });

const Post = mongoose.model('Post', PostSchema);

Post.findOne((err, data) => {
  if (!data) {
    postData.map(async item => {
      const _post = new Post(item);
      await _post.save();
    });
  }
});

export default Post;