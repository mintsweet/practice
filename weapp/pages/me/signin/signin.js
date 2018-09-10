import { signin } from '../../../service/api.js';

Page({
  data: {

  },
  onLoad: function (options) {

  },
  onReady: function () {

  },
  // 登录
  signin: function(e) {
    signin(e.detail.value).then(token => {
      wx.setStorage({
        key: 'token',
        data: token,
      });
      wx.redirectTo({
        url: '/pages/me/me',
      });
    });
  }
})