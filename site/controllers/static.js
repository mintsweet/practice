const { getStartDoc, getApiDoc, getAboutDoc } = require('../http/api');

class Static {
  // 快速开始
  async renderStartDoc(req, res) {
    try {
      const response = await getStartDoc();
      if (response.status === 1) {
        res.render('static/template', {
          title: '快速开始',
          text: response.data
        });
      } else {
        res.render('exception/error', {
          title: '快速开始',
          error: response.message
        });
      }
    } catch(err) {
      res.render('exception/500', {
        title: '500'
      });
    }
  }

  // API说明
  async renderApiDoc(req, res) {
    try {
      const response = await getApiDoc();
      if (response.status === 1) {
        res.render('static/template', {
          title: 'API说明',
          text: response.data
        });
      } else {
        res.render('exception/error', {
          title: 'API说明',
          error: response.message
        });
      }
    } catch(err) {
      res.render('exception/500', {
        title: '500'
      });
    }
  }

  // 关于
  async renderAboutDoc(req, res) {
    try {
      const response = await getAboutDoc();
      if (response.status === 1) {
        res.render('static/template', {
          title: '关于',
          text: response.data
        });
      } else {
        res.render('exception/error', {
          title: '关于',
          error: response.message
        });
      }
    } catch(err) {
      res.render('exception/500', {
        title: '500'
      });
    }
  }
}

module.exports = new Static();