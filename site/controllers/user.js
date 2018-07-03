const formidable = require('formidable');
const { getPicCaptcha, signup, apiSignin, apiForgetPass, apiSignout } = require('../http/api');

class User {
  constructor() {
    this.signup = this.signup.bind(this);
    this.signin = this.signin.bind(this);
  }

  // 获取图形验证码
  async getPicToken() {
    const response = await getPicCaptcha();
    if (response.status === 1) {
      return response.data;
    } else {
      return {};
    }
  }

  // 注册页
  async renderSignup(req, res) {
    const response = await getPicCaptcha();
    if (response.status === 1) {
      req.app.locals.pic_token = response.data.token;
      return res.render('user/signup', {
        title: '注册',
        picUrl: response.data.url
      });
    }
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

      const { nickname, mobile, password, smscaptcha } = fields;
      const sms_code = req.app.locals.sms_code || {};

      try {
        if (!mobile || !/^1[3,5,7,8,9]\d{9}$/.test(mobile)) {
          throw new Error('请输入正确的手机号');
        } else if (!password || !/(?!^(\d+|[a-zA-Z]+|[~!@#$%^&*?]+)$)^[\w~!@#$%^&*?].{6,18}/.test(password)) {
          throw new Error('密码必须为数字、字母和特殊字符其中两种组成并且在6-18位之间');
        } else if (!nickname || nickname.length > 8 || nickname.length < 2) {
          throw new Error('请输入2-8位的名称');
        } else if (sms_code.mobile !== mobile) {
          throw new Error('收取验证码的手机与登录手机不匹配');
        } else if (sms_code.code !== smscaptcha) {
          throw new Error('短信验证码不正确');
        } else if ((Date.now() - sms_code.time) / (1000 * 60) > 10) {
          throw new Error('短信验证码已经失效了，请重新获取');
        }
      } catch(err) {
        const picToken = await this.getPicToken();
        req.app.locals.pic_token = picToken.token;
        return res.render('user/signup', {
          title: '注册',
          picUrl: picToken.url,
          error: err.message
        });
      }

      const response = await signup(fields);
      if (response.status === 1) {
        return res.render('site/transfer', {
          title: '注册成功',
          text: '注册成功',
          type: 'success'
        });
      } else {
        return res.render('user/signup', {
          title: '注册',
          error: response.message
        });
      }
    });
  }

  // 登录页
  async renderSignin(req, res) {
    const response = await getPicCaptcha();
    if (response.status === 1) {
      req.app.locals.pic_token = { token: response.data.token, time: Date.now() };
      res.render('user/signin', {
        title: '登录',
        picUrl: response.data.url
      });
    }
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

      const { mobile, piccaptcha } = fields;
      const { pic_token } = req.app.locals;

      try {
        if (!mobile || !(/^1[3,5,7,8,9]\d{9}$/.test(mobile))) {
          throw new Error('请输入正确的手机号');
        } else if (!pic_token.token || piccaptcha.toLowerCase() !== pic_token.token.toLowerCase()) {
          throw new Error('图形验证码错误');
        } else if ((Date.now() - pic_token.time) / (1000 * 60) > 5) {
          throw new Error('图形验证码已经失效了，请重新获取');
        }
      } catch(err) {
        const picToken = await this.getPicToken();
        req.app.locals.pic_token = picToken.token;
        return res.render('user/signin', {
          title: '登录',
          picUrl: picToken.url,
          error: err.message
        });
      }

      const response = await apiSignin(Object.assign({ type: 'acc' }, fields));
      if (response.status === 1) {
        return res.render('site/transfer', {
          title: '登录成功',
          text: '登录成功',
          type: 'success'
        });
      } else {
        const picToken = await this.getPicToken();
        req.app.locals.pic_token = picToken.token;
        return res.render('user/signin', {
          title: '登录',
          picUrl: picToken.url,
          error: response.message
        });
      }
    });
  }

  // 忘记密码页
  async renderForgetPass(req, res) {
    const response = await getPicCaptcha();
    if (response.status === 1) {
      req.app.locals.pic_token = response.data.token;
      return res.render('user/forget_pass', {
        title: '忘记密码',
        picUrl: response.data.url
      });
    }
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

      const { sms_code } = req.app.locals;
      const { mobile, password, smscaptcha } = fields;

      try {
        if (!mobile && mobile !== sms_code.mobile) {
          throw new Error('提交手机号与获取验证码手机号不对应');
        } else if (!password || !/(?!^(\d+|[a-zA-Z]+|[~!@#$%^&*?]+)$)^[\w~!@#$%^&*?].{6,18}/.test(password)) {
          throw new Error('密码必须为数字、字母和特殊字符其中两种组成并且在6-18位之间');
        } else if (sms_code.code !== smscaptcha) {
          throw new Error('验证码错误');
        } else if (sms_code.mobile !== mobile) {
          throw new Error('收取验证码的手机与登录手机不匹配');
        } else if ((Date.now() - sms_code.time) / (1000 * 60) > 10) {
          throw new Error('验证码已失效，请重新获取');
        }
      } catch(err) {
        return res.render('user/forget_pass', {
          title: '忘记密码',
          error: err.message
        });
      }

      const response = await apiForgetPass(fields);
      if (response.status === 1) {
        return res.render('site/transfer', {
          title: '密码找回成功',
          text: '密码找回成功',
          type: 'success'
        });
      } else {
        return res.render('user/forget_pass', {
          title: '忘记密码',
          error: response.message
        });
      }
    });
  }

  // 登出
  async signout(req, res) {
    const response = await apiSignout();
    if (response.status === 1) {
      return res.render('site/transfer', {
        title: '退出成功',
        text: '退出成功',
        type: 'success'
      });
    }
  }

  // 个人信息页
  renderInfo(req, res) {
    return res.render('user/info', {
      title: '个人信息'
    });
  }

  // 积分榜前一百
  renderTop100(req, res) {
    return res.render('user/top100', {
      title: '积分榜前一百'
    });
  }
}

module.exports = new User();
