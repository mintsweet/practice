const formidable = require('formidable');
const BaseComponent = require('../prototype/BaseComponent');
const TopicModel = require('../models/topic');
// const BehaviorModel = require('../models/behavior');
const UserModel = require('../models/user');
// const NoticeModel = require('../models/notice');
const md2html = require('../utils/md2html');
const logger = require('../utils/logger');

class Topic extends BaseComponent {
  constructor() {
    super();
    this.createTopic = this.createTopic.bind(this);
    this.likeOrUnlikeTopic = this.likeOrUnlikeTopic.bind(this);
    this.collectOrUncollectTopic = this.collectOrUncollectTopic.bind(this);
  }

  // 创建话题
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

      const { _id } = req.session.userInfo;
      const { tab, title, content } = fields;

      try {
        if (!_id) {
          throw new Error('尚未登录')
        } else if (!title) {
          throw new Error('标题不能为空')
        } else if (!content) {
          throw new Error('内容不能为空')
        }
      } catch (err) {
        return res.send({
          status: 0,
          type: 'ERROR_PARAMS_CREATE_TOPIC',
          message: err.message
        });
      }

      const _topic = {
        tab,
        title,
        content: md2html(content),
        author_id: _id,
      };

      try {
        const topic = await TopicModel.create(_topic);
        await this.createBehavior('create', _id, topic.id);
        return res.send({
          status: 1
        });
      } catch(err) {
        logger.error(err.message);
        return res.send({
          status: 0,
          type: 'ERROR_SERVICE_FAILED',
          message: '服务器无响应，请稍后重试'
        });
      }
    });
  }

  // 删除话题
  async deleteTopic(req, res) {
    const { tid } = req.params;
    
    if (!tid) {
      return res.send({
        status: 0,
        type: 'ERROR_PARAMS',
        message: '无效的ID'
      });
    }

    const { _id } = req.session.userInfo;
    const currentTopic = await TopicModel.findById(tid);

    if (_id !== currentTopic.author_id.toString()) {
      return res.send({
        status: 0,
        type: 'ERROR_IS_NOT_AUTHOR',
        message: '不能删除别人的话题'
      });
    } else {
      await TopicModel.findByIdAndUpdate(tid, { delete: true });
    }
  }
  
  // 编辑话题
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

      const { tid } = req.params;
      const { _id } = req.session.userInfo;
      const currentTopic = await TopicModel.findById(tid);

      if (_id !== currentTopic.author_id.toString()) {
        return res.send({
          status: 0,
          type: 'ERROR_IS_NOT_AUTHOR',
          message: '不能编辑别人的话题'
        });
      }

      const { tab, title, content } = fields;

      const topicInfo = {
        tab: tab || currentTopic.tab,
        title: title || currentTopic.title,
        content: content || currentTopic.content
      };

      try {
        await TopicModel.findByIdAndUpdate(tid, topicInfo); 
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
    const tab = req.query.tab || 'all';
    const page = parseInt(req.query.page) || 1;
    const size = parseInt(req.query.size) || 10;

    let query = {
      lock: false
    };

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
      const topicCount = await TopicModel.count(query);
      const topicList = await TopicModel.find(query, '-__v -lock', options);

      const promises = await Promise.all(topicList.map(item => {
        return new Promise((resolve, reject) => {
          resolve(UserModel.findById(item.author_id, 'nickname avatar'));
        });
      }));

      const result = topicList.map((item, i) => {
        return { ...item.toObject({ virtuals: true }), author: promises[i] }
      });

      return res.send({
        status: 1,
        data: {
          topics: result,
          currentPage: page,
          total: size,
          totalPage: Math.ceil(topicCount / size),
          tab,
          size
        },
      });
    } catch(err) {
      return res.send({
        status: 0,
        type: 'ERROR_GET_TOPIC_LIST',
        message: '获取话题失败'
      });
    }
  }

  // 搜索话题
  async searchTopic(req, res) {
    const { title } = req.query;
    const page = parseInt(req.query.page) || 1;
    const size = parseInt(req.query.size) || 10;

    let query = {
      title: { $regex: title },
      lock: false
    };

    const options = {
      skip: (page - 1) * size,
      limit: size,
      sort: '-top -last_reply_at'
    };
    
    try {
      const topicCount = await TopicModel.count(query);
      const topicList = await TopicModel.find(query, '-__v -lock', options);

      const promises = await Promise.all(topicList.map(item => {
        return new Promise((resolve, reject) => {
          resolve(UserModel.findById(item.author_id, 'nickname avatar'));
        });
      }));

      const result = topicList.map((item, i) => {
        return { ...item.toObject({ virtuals: true }), author: promises[i] }
      });

      return res.send({
        status: 1,
        data: {
          topics: result,
          currentPage: page,
          total: topicCount,
          totalPage: Math.ceil(topicCount / size),
        },
      });
    } catch(err) {
      return res.send({
        status: 0,
        type: 'ERROR_GET_TOPIC_LIST',
        message: '获取话题失败'
      });
    }
  }
  
  // 获取话题详情
  async getTopicById(req, res) {
    const { tid } = req.params;

    if (!tid) {
      return res.send({
        status: 0,
        type: 'ERROR_PARAMS',
        message: '无效的ID'
      });
    }

    try {
      const topic = await TopicModel.findById(tid, '-__v');
      const author = await UserModel.findById(topic.author_id, '_id nickname avatar score');

      return res.send({
        status: 1,
        data: { ...topic.toObject({ virtuals: true }), author}
      });
    } catch(err) {
      return res.send({
        status: 0,
        type: 'ERROR_GET_TOPIC_DETAIL',
        message: '获取话题详情失败'
      });
    }
  }

  // 喜欢或者取消喜欢话题
  async likeOrUnlikeTopic(req, res) {
    const { tid } = req.params;
    const { _id } = req.session.userInfo;

    try {
      let behavior;
      
      behavior = await this.findOneBehavior('like', _id, tid);
      
      if (behavior) {
        behavior.delete = !behavior.delete;
        behavior = await behavior.save();
      } else {
        behavior = await this.createBehavior('like', _id, tid);
      }

      const topic = await TopicModel.findById(tid);
      const user = await UserModel.findById(_id);

      if (!topic || !user) {
        throw new Error('未找到话题或者用户');
      }

      if (behavior.delete) {
        topic.like_count -= 1;
        topic.save();
        user.like_count -= 1;
        user.save();
        req.session.userInfo.like_count -= 1;
      } else {
        topic.like_count += 1;
        topic.save();
        user.like_count += 1;
        user.save();
        req.session.userInfo.like_count += 1;
        // 发送提醒 notice
        await this.sendLikeNotice(_id, topic.author_id, topic._id);
      }

      return res.send({
        status: 1,
        type: behavior.delete ? 'un_like' : 'like'
      });
    } catch(err) {
      return res.send({
        status: 0,
        type: 'ERROR_LIKE_OR_UN_LIKE_TOPIC',
        message: '喜欢或者取消喜欢话题失败'
      });
    }
  }

  // 收藏或者取消收藏话题
  async collectOrUncollectTopic(req, res) {
    const { tid } = req.params;
    const { _id } = req.session.userInfo;
    
    try {
      let behavior;

      behavior = await this.findOneBehavior('collect', _id, tid);
      
      if (behavior) {
        behavior.delete = !behavior.delete;
        behavior.save();
      } else {
        behavior = await this.createBehavior('collect', _id, tid);
      }

      const topic = await TopicModel.findById(tid);
      const user = await UserModel.findById(_id);

      if (!topic || !user) {
        throw new Error('未找到话题或者用户');
      }

      if (behavior.delete) {
        topic.collect_count -= 1;
        topic.save();
        user.collect_count -= 1;
        user.save();
        req.session.userInfo.collect_count -= 1;
      } else {
        topic.collect_count += 1;
        topic.save();
        user.collect_count += 1;
        user.save();
        req.session.userInfo.collect_count += 1;
        // 发送提醒 notice
        await this.sendCollectNotice(_id, topic.author_id, topic._id);
      }

      return res.send({
        status: 1,
        type: behavior.delete ? 'un_collect' : 'collect'
      });
    } catch(err) {
      logger.error(err.message);
      return res.send({
        status: 0,
        type: 'ERROR_COLLECT_OR_UN_COLLECT_TOPIC',
        message: '收藏或者取消收藏话题失败'
      });
    }
  }
}

module.exports = new Topic();