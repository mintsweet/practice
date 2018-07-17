const { getStartDoc, getApiDoc, getAboutDoc } = require('../http/api');
const md2html = require('../utils/md2html');

class Static {
  // 快速开始
  async renderStartDoc(req, res) {
    const text = await getStartDoc();
    res.render('site/static', {
      title: '快速开始',
      text: md2html(text)
    });
  }

  // API说明
  async renderApiDoc(req, res) {
    const text = await getApiDoc();
    res.render('site/static', {
      title: 'API说明',
      text: md2html(text)
    });
  }

  // 关于
  async renderAboutDoc(req, res) {
    const text = await getAboutDoc();
    res.render('site/static', {
      title: '关于',
      text: md2html(text)
    });
  }
}

module.exports = new Static();