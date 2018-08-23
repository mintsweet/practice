const perfix = 'http://localhost:3000';
const request = (params, url) => {
  wx.showLoading({
    title: 'Loading...'
  });

  wx.request({
    url: perfix + url,
    data: params.data || {},
    header: {
      'content-type': 'application/json'
    },
    method: params.method || 'GET',
    success: res => {
      params.success && params.success(res);
      wx.hideLoading();
    }
  });
};

export default request;
