const API = require('../utils/api');
const BaseService = require('../core/BaseService');

class User extends BaseService {
  constructor() {
    super();
    this.signup = this.signup.bind(this);
    this.signin = this.signin.bind(this);
    this.forgetPass = this.forgetPass.bind(this);
  }

  // 获取验证码
  async getCaptcha(req, res) {
    try {
      const url = this._getCaptchaUrl(req);
      res.send({ status: 1, url });
    } catch (err) {
      res.send({ status: 0, message: err.message });
    }
  }

  // 注册
  async signup(req, res) {
    const { nickname, email, password, captcha } = req.body;
    const { captcha: data } = req.session;

    try {
      if (captcha.toUpperCase() !== data.token) {
        throw new Error('图形验证码错误');
      } else if (Date.now() > data.expired) {
        throw new Error('图形验证码已经失效了，请重新获取');
      }

      await API.signup({ nickname, email, password });

      res.render('pages/jump', {
        type: 'success',
        url: '/',
        message: '注册成功',
      });
    } catch (err) {
      const url = await this._getCaptchaUrl(req);
      res.render('pages/signup', {
        title: '注册',
        error: err.error,
        url,
      });
    }
  }

  // 登录
  async signin(req, res) {
    const { email, password, captcha } = req.body;
    const { captcha: data } = req.session;

    try {
      if (captcha.toUpperCase() !== data.token) {
        throw new Error('图形验证码错误');
      } else if (Date.now() > data.expired) {
        throw new Error('图形验证码已经失效了，请重新获取');
      }

      req.session.token = await API.signin({
        email,
        password,
      });

      res.redirect('/');
    } catch (err) {
      const url = await this._getCaptchaUrl(req);
      res.render('pages/signin', {
        title: '登录',
        error: err.message,
        url,
      });
    }
  }

  // 登出
  async signout(req, res) {
    req.session.token = '';
    req.app.locals.user = null;
    res.redirect('/');
  }

  // 忘记密码
  async forgetPass(req, res) {
    const { email, captcha } = req.body;
    const { captcha: data } = req.session;

    try {
      if (captcha.toUpperCase() !== data.token) {
        throw new Error('图形验证码错误');
      } else if (Date.now() > data.expired) {
        throw new Error('图形验证码已经失效了，请重新获取');
      }

      await API.forgetPass({ email });

      res.render('pages/reset-pass', {
        title: '重置密码',
        email,
      });
    } catch (err) {
      const url = await this._getCaptchaUrl(req);
      res.render('pages/forget-pass', {
        title: '忘记密码',
        error: err.message,
        url,
      });
    }
  }

  // 更新个人设置
  async setting(req, res) {
    const { id } = req.app.locals.user;
    const { token } = req.session;

    try {
      await API.updateSetting(req.body, token);
      res.redirect('/user-setting');
    } catch (err) {
      const [top100, user] = await Promise.all([
        API.getUsersTop(),
        API.getUserById(id),
      ]);

      res.render('pages/user-setting', {
        title: '个人资料',
        error: err.message,
        top100,
        user,
      });
    }
  }

  // 修改密码
  async updatePass(req, res) {
    const { token } = req.session;

    try {
      await API.updatePass(req.body, token);
      res.redirect('/update-pass');
    } catch (err) {
      const data = await API.getUsersTop();
      res.render('pages/user-update-pass', {
        title: '修改密码',
        error: err.error,
        top100: data,
      });
    }
  }

  // 关注或者取消关注
  async followOrUn(req, res) {
    const { token } = req.session;
    const { uid } = req.params;

    try {
      const action = await API.followOrUn(uid, token);

      res.send({
        status: 1,
        action,
      });
    } catch (err) {
      res.send({
        status: 0,
        message: err.error,
      });
    }
  }
}

module.exports = new User();
