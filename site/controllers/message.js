class Message {
  // 消息页
  renderMessage(req, res) {
    return res.render('message/index', {
      title: '用户消息'
    });
  }
  
  // 系统消息
  renderSystemMessage(req, res) {
    return res.render('message/system', {
      title: '系统消息'
    });
  }
}

module.exports = new Message();