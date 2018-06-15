const formidable = require('formidable');
const BaseComponent = require('../prototype/BaseComponent');
const TopicModel = require('../models/topic');
const UserModel = require('../models/user');

class Topic extends BaseComponent {
  constructor() {
    super();
    this.createTopic = this.createTopic.bind(this);
    this.getTopicList = this.getTopicList.bind(this);
    this.getTopicDetail = this.getTopicDetail.bind(this);
  }

  // 新增
  createTopic(req, res) {
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
      const { tab, title, content } = fields;

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
        tab: tab,
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

  // 获取用户信息
  async getUserInfo(id) {
    const userInfo = await UserModel.findOne({ id: id }, '-_id id nickname avatar');
    return userInfo;
  }
  
  // 获取列表
  async getTopicList(req, res) {
    const tab = req.query.tab || 'all';
    const page = parseInt(req.query.page) > 0 || 1;
    const size = parseInt(req.query.size) || 10;

    let query = {};

    if (!tab || tab === 'all') {
      query = {};
    } else {
      if (tab === 'good') {
        query.good = true;
      } else {
        query.tab = tab;
      }
    }

    const options = {
      skip: (page - 1) * size,
      limit: size,
      sort: '-top -last_reply_at'
    };

    try {
      const topicList = await TopicModel.find(query, '-_id', options);

      const promises = await Promise.all(topicList.map(item => {
        return new Promise((resolve, reject) => {
          resolve(this.getUserInfo(item.author_id));
        });
      }));

      const result = topicList.map((item, i) => {
        return Object.assign({ author: promises[i], tabName: item.tabName }, item.toObject());
      });

      return res.send({
        status: 1,
        data: result
      });
    } catch(err) {
      console.log(err)

      return res.send({
        status: 0,
        type: 'ERROR_GET_Topic_LIST',
        message: '获取主题失败'
      });
    }
  }
  
  // 获取主题详情
  async getTopicDetail(req, res) {
    const { id } = req.params;

    if (!id) {
      return res.send({
        status: 0,
        type: 'ERROR_PARAMS',
        message: '无效的ID'
      });
    }

    try {
      const topic = await TopicModel.findOne({ id }, '-_id -__v');
      const author = await this.getUserInfo(topic.author_id);

      return res.send({
        status: 1,
        data: topic
      });
    } catch(err) {
      return res.send({
        status: 0,
        type: 'ERROR_GET_TOPIC_DETAIL',
        message: err.message
      });
    }
  }

  // 编辑主题
  editTopic(req, res) {
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
      const { id, tab, title, content } = fields;

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

      const topicInfo = {
        tab: tab,
        title,
        content
      };

      try {
        await TopicModel.findOneAndUpdate({ id }, topicInfo); 
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

  // 收藏主题
  collectTopic(req, res) {
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
      const { id } = fields;

      try {
        if (!id) {
          throw new Error('id不能为空')
        }
      } catch (err) {
        return res.send({
          status: 0,
          type: 'ERROR_PARAMS',
          message: err.message
        });
      }

      try {
        // await TopicModel.findOneAndUpdate({ id });
        // await UserModel.findOneAndUpdate({ id: userInfo.id }, { collect_list: }) 
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

  // 取消收藏主题
  unCollectTopic(req, res) {
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
      const { id } = fields;

      try {
        if (!id) {
          throw new Error('id不能为空')
        }
      } catch (err) {
        return res.send({
          status: 0,
          type: 'ERROR_PARAMS',
          message: err.message
        });
      }

      try {
        // await TopicModel.findOneAndUpdate({ id });
        // await UserModel.findOneAndUpdate({ id: userInfo.id }, { collect_list: }) 
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
}

module.exports = new Topic();