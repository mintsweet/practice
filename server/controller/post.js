import BaseComponent from '../prototype/BaseComponent';
import PostModel from '../models/post';

class Post extends BaseComponent {
  async getPostTop(req, res) {
    try {
      const posts = await PostModel.find();
      const tops = posts.filter(item => item.is_top);
      return res.send({
        status: 1,
        data: tops
      });
    } catch(err) {
      return res.send({
        status: 0,
        type: 'ERROR_GET_TOP_LIST',
        message: err.message
      });
    }
  }

  async getPostList(req, res) {
    try {
      const posts = await PostModel.find();
      return res.send({
        status: 1,
        data: posts
      });
    } catch(err) {
      return res.send({
        status: 0,
        type: 'ERROR_GET_POST_LIST',
        message: err.message
      });
    }
  }
}

export default new Post();