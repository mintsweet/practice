class Message {
  // 消息页
  renderMessage(req, res) {
    return res.render('message/all', {
      title: '全部消息'
    });
  }  
}

module.exports = new Message();