class Message {
  // 渲染消息页面
  renderMessage(req, res) {
    return res.render('message/all');
  }  
}

module.exports = new Message();