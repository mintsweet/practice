const {
  getUserInfoById, getPicCaptcha,
  getUsersTop100, getNoReplyTopic,
  getUsersStar
} = require('../http/api');

module.exports = class BaseComponent {
  // 获取用户信息
  async getUserInfo(id) {
    const info = await getUserInfoById(id);
    return info;
  }

  // 获取图形验证码
  async getPicCaptcha(req) {
    const data = await getPicCaptcha();

    req.app.locals.pic_token = {
      token: data.token,
      expired: Date.now() + 1000 * 60 * 10
    };

    return data.url;
  }

  // 获取积分榜前一百
  async getUsersTop100() {
    const top100 = await getUsersTop100();
    return top100;
  }

  // 获取无人回复的话题
  async getNoReplyTopic() {
    const noReplyTopic = await getNoReplyTopic();
    return noReplyTopic;
  }

  // 获取星标用户列表
  async getUsersStar() {
    const stars = await getUsersStar();
    return stars;
  }
};
