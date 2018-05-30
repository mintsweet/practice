const rq = require('request-promise');
const md = require('markdown-it')();
const fs = require('fs');
const path = require('path');

class Home {
  // 首页
  async index(req, res) {
    const { tab, page } = req.query;
    let topics = [];
    let userTop = [];

    const topicRespone = await rq(`http://localhost:3000/api/topic/list?tab=${tab}&page=${page}`);
    const userRespone = await rq('http://localhost:3000/api/user/top100');

    if (topicRespone.status === 1) {
      topics = topicRespone.data;
    }

    if (userRespone.status === 1) {
      userTop = userRespone.data;
    }

    res.render('index', {
      title: '首页',
      topics,
      userTop
    });
  }

  // 新手入门
  getStart(req, res) {
    fs.readFile(path.join(__dirname, '../data/getStart.md'), 'utf-8', (err, data) => {
      const text = md.render(data);
      return res.render('getStart', {
        title: '新手入门',
        text
      });
    });
  }

  // API说明
  apiIntroduction(req, res) {
    fs.readFile(path.join(__dirname, '../data/API.md'), 'utf-8', (err, data) => {
      const text = md.render(data);
      return res.render('apiIntroduction', {
        titile: 'API说明',
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