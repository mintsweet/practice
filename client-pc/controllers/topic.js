exports.renderCreate = (req, res) => {
  res.render('/topic/create', {
    title: '发布话题'
  });
}