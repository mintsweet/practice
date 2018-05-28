const rq = require('request-promise');

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
    res.render('getStart', {
      titile: '新手入门',
    });
  }

  // API说明
  apiIntroduction(req, res) {
    res.render('apiIntroduction', {
      titile: 'API说明',
    });
  }

  // 关于
  about(req, res) {
    res.render('about', {
      titile: '关于',
    });
  }
}

module.exports = new Home();