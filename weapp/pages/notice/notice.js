import { getUserNotice, getSystemNotice } from '../../service/api.js';

Page({
  data: {
    type: 'user',
    data: []
  },
  onReady: function () {
    wx.getStorage({
      key: 'token',
      success: res => {
        this.getNoticeData(this.data.type);
      },
      fail: function (res) {
        wx.redirectTo({
          url: '/pages/me/signin/signin',
        });
      }
    });
  },
  // 获取消息数据
  getNoticeData: function(type) {
    if (type === 'user') {
      getUserNotice().then(data => {
        console.log(data);
        this.setData({ data });
      });
    } else if (type === 'system') {
      getSystemNotice().then(data => {
        this.setData({ data });
      });
    }
  },
  // 改变消息类型
  handleChangeType: function(e) {
    const type = e.currentTarget.dataset.type;
    this.getNoticeData(type);
    this.setData({ type });
  }
})