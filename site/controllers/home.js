const md = require('markdown-it')();
const fs = require('fs');
const path = require('path');
const { getUserTop100 } = require('./user');

class Home {
  // 首页
  async index(req, res) {
    const { tab, page } = req.query;
    const userTop = await getUserTop100();

    res.render('index', {
      title: '首页',
      userTop
    });
  }

  // 新手入门
  getStart(req, res) {
    fs.readFile(path.join(__dirname, '../data/getStart.md'), 'utf-8', (err, data) => {
      const text = md.render(data);
      return res.render('get_start', {
        title: '新手入门',
        text
      });
    });
  }

  // API说明
  apiIntroduction(req, res) {
    fs.readFile(path.join(__dirname, '../data/API.md'), 'utf-8', (err, data) => {
      const text = md.render(data);
      return res.render('api_introduction', {
        title: 'API说明',
        text
      });
    });
  }

  // 关于
  about(req, res) {
    fs.readFile(path.join(__dirname, '../data/about.md'), 'utf-8', (err, data) => {
      const text = md.render(data);
      return res.render('about', {
        title: '关于',
        text
      });
    });
  }
}

module.exports = new Home();