const perfix = 'http://localhost:3000';
const request = (params, url) => {
  wx.showLoading({
    title: 'Loading...'
  });

  wx.request({
    url: perfix + url,
    data: params.data || {},
    method: params.method || 'GET',
    success: res => {
      if (res.statusCode === 200) {
        params.success && params.success(res.data);
        wx.hideLoading();
      }
    }
  });
};

export default request;
