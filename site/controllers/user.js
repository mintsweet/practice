const formidable = require('formidable');
const {
  getPicCaptcha, signup, signin, forgetPass,
  signout, getUsersTop100, getUserInfoById,
  getUserStars, getUserCollections, getUserReplies,
  getUserBehaviors, getUserFollower, getUserFollowing,
  setting, updatePass, getCurrentUserInfo, followOrUn
} = require('../http/api');

class User {
  constructor() {
    this.renderSignup = this.renderSignup.bind(this);
    this.signup = this.signup.bind(this);
    this.renderSignin = this.renderSignin.bind(this);
    this.signin = this.signin.bind(this);
    this.renderForgetPass = this.renderForgetPass.bind(this);
    this.forgetPass = this.forgetPass.bind(this);
  }

  async getPicCaptcha(req) {
    try {
      const response = await getPicCaptcha();
      if (response.status === 1) {
        req.app.locals.pic_token = {
          token: response.data.token,
          expired: Date.now() + 1000 * 60 * 10
        };
        return response.data.url;
      } else {
        return '';
      }
    } catch(err) {
      return '';
    }
  }

  // 注册页
  async renderSignup(req, res) {
    const url = await this.getPicCaptcha(req);
    return res.render('user/signup', {
      title: '注册',
      picUrl: url
    });
  }

  // 注册
  signup(req, res) {
    const form = new formidable.IncomingForm();
    form.parse(req, async (err, fields) => {
      if (err) {
        return res.render('user/signup', {
          title: '注册',
          error: err
        });
      }

      const sms_code = req.app.locals.sms_code || {};
      const url = await this.getPicCaptcha(req);

      if (!sms_code.mobile) {
        return res.render('user/signup', {
          title: '注册',
          error: '尚未获取短信验证码',
          picUrl: url
        });
      }

      const response = await signup(fields);
      if (response.status === 1) {
        return res.render('site/transform', {
          title: '注册成功',
          type: 'success',
          message: '注册成功'
        });
      } else {
        return res.render('user/signup', {
          title: '注册',
          error: response.message,
          picUrl: url
        });
      }
    });
  }

  // 登录页
  async renderSignin(req, res) {
    const url = await this.getPicCaptcha(req);
    res.render('user/signin', {
      title: '登录',
      picUrl: url
    });
  }

  // 登录
  signin(req, res) {
    const form = new formidable.IncomingForm();
    form.parse(req, async (err, fields) => {
      if (err) {
        return res.render('user/signin', {
          title: '登录',
          error: err
        });
      }

      const { mobile, password, piccaptcha } = fields;
      const { pic_token } = req.app.locals;

      const url = await this.getPicCaptcha(req);

      if (piccaptcha.toUpperCase() !== pic_token.token) {
        return res.render('user/signin', {
          title: '登录',
          error: '图形验证码错误',
          picUrl: url
        });
      } else if (Date.now() > pic_token.expired) {
        return res.render('user/signin', {
          title: '登录',
          error: '图形验证码已经失效了，请重新获取',
          picUrl: url
        });
      }

      const response = await signin({ mobile, password });
      if (response.status === 1) {
        return res.render('site/transform', {
          title: '登录成功',
          type: 'success',
          message: '登录成功'
        });
      } else {
        return res.render('user/signin', {
          title: '登录',
          error: response.message,
          picUrl: url
        });
      }
    });
  }

  // 忘记密码页
  async renderForgetPass(req, res) {
    const url = await this.getPicCaptcha(req);
    res.render('user/forget_pass', {
      title: '忘记密码',
      picUrl: url
    });
  }

  // 忘记密码
  async forgetPass(req, res) {
    const form = new formidable.IncomingForm();
    form.parse(req, async (err, fields) => {
      if (err) {
        return res.render('user/forget_pass', {
          title: '忘记密码',
          error: err
        });
      }

      const sms_code = req.app.locals.sms_code || {};
      const url = await this.getPicCaptcha(req);

      if (!sms_code.mobile) {
        return res.render('user/forget_pass', {
          title: '忘记密码',
          error: '尚未获取短信验证码',
          picUrl: url
        });
      }

      const response = await forgetPass(fields);
      if (response.status === 1) {
        return res.render('site/transform', {
          title: '找回密码成功',
          type: 'success',
          message: '找回密码成功'
        });
      } else {
        return res.render('user/forget_pass', {
          title: '忘记密码',
          error: response.message,
          picUrl: url
        });
      }
    });
  }

  // 登出
  async signout(req, res) {
    const response = await signout();
    if (response.status === 1) {
      return res.render('site/transform', {
        title: '退出成功',
        type: 'success',
        message: '退出成功'
      });
    }
  }

  // 积分榜前一百
  async renderUserTop100(req, res) {
    const response = await getUsersTop100();

    if (response.status === 1) {
      return res.render('user/top100', {
        title: '积分榜前一百',
        top100: response.data
      });
    } else {
      return res.redirect('/exception/500');
    }
  }

  // 个人信息页
  async renderUserInfo(req, res) {
    const { uid } = req.params;

    let response;
    let info;
    let isFollow;
    let behaviors;

    response = await getUserInfoById(uid);

    if (response.status === 1) {
      info = response.data;
      isFollow = response.isFollow || false;
    } else {
      return res.redirect('/exception/500');
    }

    response = await getUserBehaviors(uid);
    if (response.status === 1) {
      behaviors = response.data;
    } else {
      return res.redirect('/exception/500');
    }

    return res.render('user/info', {
      title: '动态 - 用户信息',
      info,
      data: behaviors,
      type: 'behavior',
      isFollow
    });
  }

  // 用户喜欢页
  async renderUserStars(req, res) {
    const { uid } = req.params;

    let response;
    let info;
    let isFollow;
    let behaviors;

    response = await getUserInfoById(uid);
    if (response.status === 1) {
      info = response.data;
      isFollow = response.isFollow || false;
    } else {
      return res.redirect('/exception/500');
    }

    response = await getUserStars(uid);
    if (response.status === 1) {
      behaviors = response.data;
    } else {
      return res.redirect('/exception/500');
    }

    return res.render('user/info', {
      title: '喜欢 - 用户信息',
      info,
      data: behaviors,
      type: 'star',
      isFollow
    });
  }

  // 用户收藏页
  async renderUserCollections(req, res) {
    const { uid } = req.params;

    let response;
    let info;
    let isFollow;
    let behaviors;

    response = await getUserInfoById(uid);
    if (response.status === 1) {
      info = response.data;
      isFollow = response.isFollow || false;
    } else {
      return res.redirect('/exception/500');
    }

    response = await getUserCollections(uid);
    if (response.status === 1) {
      behaviors = response.data;
    } else {
      return res.redirect('/exception/500');
    }

    return res.render('user/info', {
      title: '喜欢 - 用户信息',
      info,
      data: behaviors,
      type: 'star',
      isFollow
    });
  }

  // 用户回复页
  async renderUserReplies(req, res) {
    const { uid } = req.params;

    let response;
    let info;
    let isFollow;
    let behaviors;

    response = await getUserInfoById(uid);
    if (response.status === 1) {
      info = response.data;
      isFollow = response.isFollow || false;
    } else {
      return res.redirect('/exception/500');
    }

    response = await getUserReplies(uid);
    if (response.status === 1) {
      behaviors = response.data;
    } else {
      return res.redirect('/exception/500');
    }

    return res.render('user/info', {
      title: '回复 - 用户信息',
      info,
      data: behaviors,
      type: 'reply',
      isFollow
    });
  }

  // 用户粉丝页
  async renderUserFollower(req, res) {
    const { uid } = req.params;

    let response;
    let info;
    let isFollow;
    let behaviors;

    response = await getUserInfoById(uid);
    if (response.status === 1) {
      info = response.data;
      isFollow = response.isFollow || false;
    } else {
      return res.redirect('/exception/500');
    }

    response = await getUserFollower(uid);
    if (response.status === 1) {
      behaviors = response.data;
    } else {
      return res.redirect('/exception/500');
    }

    return res.render('user/info', {
      title: '粉丝 - 用户信息',
      info,
      data: behaviors,
      type: 'follower',
      isFollow
    });
  }

  // 用户关注页
  async renderUserFolloing(req, res) {
    const { uid } = req.params;

    let response;
    let info;
    let isFollow;
    let behaviors;

    response = await getUserInfoById(uid);
    if (response.status === 1) {
      info = response.data;
      isFollow = response.isFollow || false;
    } else {
      return res.redirect('/exception/500');
    }

    response = await getUserFollowing(uid);
    if (response.status === 1) {
      behaviors = response.data;
    } else {
      return res.redirect('/exception/500');
    }

    return res.render('user/info', {
      title: '关注 - 用户信息',
      info,
      data: behaviors,
      type: 'following',
      isFollow
    });
  }

  // 更新个人设置页
  renderSetting(req, res) {
    res.render('user/setting', {
      title: '个人资料'
    });
  }

  // 更新个人设置
  setting(req, res) {
    const form = new formidable.IncomingForm();
    form.parse(req, async (err, fields) => {
      if (err) {
        return res.render('user/setting', {
          title: '个人资料',
          error: err
        });
      }

      const response = await setting({ ...fields });

      if (response.status === 1) {
        const userInfo = await getCurrentUserInfo();
        if (userInfo.status === 1) {
          req.app.locals.user = userInfo.data;
        }
        return res.render('user/setting', {
          title: '个人资料'
        });
      } else {
        return res.render('user/setting', {
          title: '个人资料',
          error: response.message
        });
      }
    });
  }

  // 修改密码页
  renderUpdatePass(req, res) {
    res.render('user/update_pass', {
      title: '修改密码'
    });
  }

  // 修改密码
  updatePass(req, res) {
    const form = new formidable.IncomingForm();
    form.parse(req, async (err, fields) => {
      if (err) {
        return res.render('user/update_pass', {
          title: '修改密码',
          error: err
        });
      }

      const response = await updatePass({ ...fields });

      if (response.status === 1) {
        return res.render('user/update_pass', {
          title: '修改密码'
        });
      } else {
        return res.render('user/update_pass', {
          title: '修改密码',
          error: response.message
        });
      }
    });
  }

  // 关注或者取消关注
  async followOrUnfollowUser(req, res) {
    const { uid } = req.params;

    const response = await followOrUn(uid);

    if (response.status === 1) {
      return res.send({
        status: 1,
        action: response.action
      });
    } else {
      return res.send({
        status: 0,
        message: response.message
      });
    }
  }
}

module.exports = new User();
