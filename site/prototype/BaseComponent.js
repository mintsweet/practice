const {
  getUserInfoById, getPicCaptcha,
  getUsersTop100, getNoReplyTopic,
  getUsersStar
} = require('../http/api');

module.exports = class BaseComponent {
  // 错误
  renderError(res, err) {
    res.render('exception/error', {
      title: '错误',
      error: err
    });
  }

  // 获取用户信息
  async getUserInfo(id) {
    try {
      const response = await getUserInfoById(id);
      if (response.status === 1) {
        return response.data;
      } else {
        return {};
      }
    } catch(err) {
      return {};
    }
  }

  // 获取图形验证码
  async getPicCaptcha(req) {
    try {
      const data = await getPicCaptcha();
      req.app.locals.pic_token = {
        token: data.token,
        expired: Date.now() + 1000 * 60 * 10
      };
      return data.url;
    } catch(err) {
      console.log('getPicCaptcha');
      throw new Error(err.message);
    }
  }

  // 获取积分榜前一百
  async getUsersTop100() {
    try {
      const response = await getUsersTop100();
      if (response.status === 1) {
        return response.data;
      } else {
        return [];
      }
    } catch(err) {
      return [];
    }
  }

  // 获取无人回复的话题
  async getNoReplyTopic() {
    try {
      const response = await getNoReplyTopic();
      if (response.status === 1) {
        return response.data;
      } else {
        return [];
      }
    } catch(err) {
      return [];
    }
  }

  // 获取星标用户列表
  async getUsersStar() {
    try {
      const response = await getUsersStar();
      if (response.status === 1) {
        return response.data;
      } else {
        return [];
      }
    } catch(err) {
      return [];
    }
  }
};
