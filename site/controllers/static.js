const {
  getStartDoc,
  getApiDoc,
  getAboutDoc
} = require('../http/api');

class Static {
  // 快速开始
  async renderStartDoc(req, res) {
    const response = await getStartDoc();
    res.render('static/template', {
      title: '快速开始',
      text: response.data
    });
  }

  // API说明
  async renderApiDoc(req, res) {
    const response = await getApiDoc();
    res.render('static/template', {
      title: 'API说明',
      text: response.data
    });
  }

  // 关于
  async renderAboutDoc(req, res) {
    const response = await getAboutDoc();
    res.render('static/template', {
      title: '关于',
      text: response.data
    });
  }
}

module.exports = new Static();