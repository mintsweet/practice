const path = require('path');
const fs = require('fs');
const md2html = require('../utils/md2html');
const API = require('../utils/api');

class Site {
  // 首页
  async renderIndex(req, res) {
    const { tab, page } = req.query;

    const top100 = await API.getUsersTop();
    const noReplyTopic = await API.getTopicsNoReply({ count: 5 });

    const data = await API.getTopics({
      tab,
      page,
      size: 20,
    });

    return res.render('pages/index', {
      title: '首页',
      topics: data.topics,
      totalPage: data.totalPage,
      currentPage: data.currentPage,
      currentTab: data.currentTab,
      top100: top100.slice(0, 10),
      tabs: data.tabs,
      noReplyTopic
    });
  }

  renderNormsDoc(req, res) {
    const data = fs.readFileSync(path.join(__dirname, '../assets/norms.md'), 'utf8');

    res.render('pages/static', {
      title: '社区规范',
      content: md2html(data)
    });
  }
}

module.exports = new Site();
