const {
  getStartData,
  getApiData,
  getAboutData,
  getMarkdownData
} = require('../http/api');

class Static {
  // 快速开始
  async getStart(req, res) {
    const response = await getStartData();
    res.render('static/get_start', {
      title: '快速开始',
      text: response.data
    });
  }

  // API说明
  async getApiIntroduction(req, res) {
    const response = await getApiData();
    res.render('static/api_introduction', {
      title: 'API说明',
      text: response.data
    });
  }

  // 关于
  async getAbout(req, res) {
    const response = await getAboutData();
    res.render('static/about', {
      title: '关于',
      text: response.data
    });
  }

  // Markdown演示
  async getMarkdown(req, res) {
    const response = await getMarkdownData();
    res.render('static/markdown_style', {
      title: 'Markdown演示',
      text: response.data
    });
  }
}

module.exports = new Static();