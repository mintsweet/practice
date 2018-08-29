const api = require('../../service/api.js');

Page({
  data: {
    tabs: [],
    currentTab: 'all',
    topics: []
  },
  onReady: function () {
    api.getTopicList({
      success: res => {
        console.log(res);
        this.setData({
          tabs: res.tabs,
          currentTab: res.tab,
          topics: res.topics
        });
      }
    });
  },
})