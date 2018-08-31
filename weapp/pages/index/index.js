import { getTopicList} from '../../service/api.js';

Page({
  data: {
    tabs: [],
    currentTab: 'all',
    topics: []
  },
  onReady: function () {
    getTopicList().then(res => {
      this.setData({
        tabs: [{ name: '全部', url: 'all' }, { name: '精华', url: 'good' }].concat(res.tabs),
        currentTab: res.currentTab,
        topics: res.topics
      });
    });
  },
})