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
    const { id } = req.params;
    const { userInfo } = req.session;
    if (!id) {
      return res.send({
        status: 0,
        type: 'ERROR_PARMAS',
        message: '获取ID失败'
      });
    }

    if (!userInfo) {
      return res.send({
        status: 0,
        type: 'ERROR_GET_USER_INFO',
        message: '尚未登录'
      });
    }

    if (userInfo.praise_list.includes(id)) {
      return res.send({
        status: 0,
        type: 'ERROR_REPEATED_OPERATION',
        message: '你已经点过赞了'
      });
    }

    const post = await PostModel.findOne({ id }, '-_id -__v');
    const praise_num = post.praise_num++;
    await PostModel.findOneAndUpdate({ id }, { praise_num });
    
  }

  async collectPost(req, res) {
    
  }

  async commentPost(req, res) {
    
  }
}

module.exports = new Post();