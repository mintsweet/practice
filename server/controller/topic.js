const formidable = require('formidable');
const BaseComponent = require('../prototype/BaseComponent');
const TopicModel = require('../models/topic');

class Topic extends BaseComponent {
  constructor() {
    super();
    this.addTopic = this.addTopic.bind(this);
  }

  // 新增
  addTopic(req, res) {
    const form = new formidable.IncomingForm();
    form.parse(req, async (err, fields, files) => {
      if (err) {
        return res.send({
          status: 0,
          type: 'ERROR_PARMAS',
          message: '参数解析失败'
        });
      }

      const { userInfo } = req.session;
      const { title, content } = fields;

      try {
        if (!userInfo || !userInfo.id) {
          throw new Error('尚未登录')
        } else if (!title) {
          throw new Error('标题不能为空')
        } else if (!content) {
          throw new Error('内容不能为空')
        }
      } catch (err) {
        return res.send({
          status: 0,
          type: 'ERROR_PARAMS',
          message: err.message
        });
      }

      const topicId = await this.getId('topic_id');
      const topicInfo = {
        id: topicId,
        title,
        content,
        author_id: userInfo.id,
      };

      try {
        await TopicModel.create(topicInfo);
        return res.send({
          status: 1
        });
      } catch(err) {
        return res.send({
          status: 0,
          type: 'ERROR_SERVICE_FAILED',
          message: '服务器无响应，请稍后重试'
        });
      }
    });
  }
  
  // 获取列表
  async getTopicList(req, res) {
    const { tab } = req.query;
    const page = req.query.page | 1;
    const size = req.query.size | 10;

    try {
      const topicList = await TopicModel.find({}, '-_id', {
        skip: (page - 1) * size,
        limit: size
      });

      return res.send({
        status: 1,
        data: topicList
      });
    } catch(err) {
      return res.send({
        status: 0,
        type: 'ERROR_GET_Topic_LIST',
        message: '获取主题失败'
      });
    }
  }
  
  // 获取主题详情
  getTopicDetail(req, res) {

  }

  // 编辑主题
  editTopic(req, res) {

  }

  // 收藏主题
  collectTopic(req, res) {

  }

  // 取消收藏主题
  unCollectTopic(req, res) {
    
  }
}

module.exports = new Topic();