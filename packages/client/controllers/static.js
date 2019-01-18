const { getNormsDoc } = require('../utils/api');

class Static {
  async renderNormsDoc(req, res) {
    const data = await getNormsDoc();

    res.render('pages/static', {
      title: '社区规范',
      content: data
    });
  }
}

module.exports = new Static();
