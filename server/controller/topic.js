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

      const { userInfo } = req.sessions;
      const { title, content } = fields;

    });
  }
  
}

module.exports = new Topic();