const BaseComponent = require('../prototype/BaseComponent');
const PostModel = require('../models/post');

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
      const posts = await PostModel.find({}, '-_id -__v');
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
      try {
        const post = await PostModel.findOne({ id }, '-_id -__v');
        if (!post) {
          return res.send({
            status: 0,
            typpe: 'ERROR_NO_EXIST_POST',
            message: '文章不存在'
          });
        } else {
          return res.send({
            status: 1,
            data: post
          });
        }
      } catch(err) {
        return res.send({
          status: 0,
          type: 'ERROR_SERVICE_FAILED',
          message: '服务器无响应，请稍后重试'
        });
      }
    }
  }

  async likePost(req, res) {
    
  }

  async commentPost(req, res) {
    
  }
}

module.exports = new Post();