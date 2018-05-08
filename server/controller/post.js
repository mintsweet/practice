import BaseComponent from '../prototype/BaseComponent';
import PostModel from '../models/post';

class Post extends BaseComponent {
  async getTop(req, res) {
    try {
      const posts = await PostModel.find({}, '-_id -__v');
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

  async getList(req, res) {
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

  async getInfoById(req, res) {
    const { id } = req.params;
    if (!id) {
      return res.send({
        status: 0,
        type: 'ERROR_NO_ID',
        
      });
    } else {

    }
  }
}

export default new Post();