import { getQuickStartDoc, getApiDoc, getAboutDoc } from '../../service/api.js';

Page({
  data: {
    type: 'quick_start',
    text: ''
  },
  onLoad: function (options) {
    this.setData({
      type: options.type
    });
  },
  onReady: function () {
    const { type } = this.data;
    if (type === 'quick_start') {
      getQuickStartDoc().then(text => {
        this.setData({ text });
      });
    } else if (type === 'api_doc') {
      getApiDoc().then(text => {
        this.setData({ text });
      });
    } else if (type === 'about') {
      getAboutDoc().then(text => {
        this.setData({ text });
      });
    }
  },
})