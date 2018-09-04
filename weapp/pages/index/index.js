import { getTopicList } from '../../service/api.js';

Page({
  data: {
    tabs: [],
    currentTab: 'all',
    topics: []
  },
  onReady: function () {
    this.getTopicList({});
  },
  // 获取话题列表
  getTopicList: function(params) {
    getTopicList(params).then(res => {
      this.setData({
        tabs: [{ name: '全部', url: 'all' }, { name: '精华', url: 'good' }].concat(res.tabs),
        currentTab: res.currentTab,
        topics: res.topics
      });
    });
  },
  // 切换tab
  onChangeTab: function(e) {
    const tab = e.currentTarget.dataset.tab;
    this.getTopicList({ tab });
  },
})