const BaseComponent = require('../prototype/BaseComponent')
const MessageModel = require('../models/message');

class Message extends BaseComponent {
  async getAllMessage(req, res) {
    try {
      const message = await MessageModel.find();
      return res.send({
        status: 1,
        data: message
      });
    } catch(err) {
      return res.send({
        status: 0,
        type: 'ERROR_SERVICE_FAILED',
        message: '服务器无响应，请稍后重试'
      });
    }
  }

  async getMessageByType(req, res) {
    const { type } = req.params;

    if (!type) {
      return res.send({
        status: 0,
        type: 'ERROR_PARAMS',
        message: '无效的类型'
      });
    }

    try {
      const message = await MessageModel.find({ type });
      return res.send({
        status: 1,
        data: message
      });
    } catch(err) {
      return res.send({
        status: 0,
        type: 'ERROR_SERVICE_FAILED',
        message: '服务器无响应，请稍后重试'
      });
    }
  }
}

module.exports = new Message();
