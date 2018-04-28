import BaseComponent from '../prototype/BaseComponent';
import UserModel from '../models/admin';

class Common extends BaseComponent {
  async getMsgCaptcha(req, res) {
    const { mobile } = req.query;
    if (!mobile || !/^1[3,5,7,8,9]\d{9}$/.test(mobile)) {
      return res.send({
        status: 0,
        type: 'ERROR_MOBILE_FORMAT',
        message: '手机号格式不正确'
      });
    }

    const existUser = await UserModel.findOne({ mobile });

    if (!existUser) {
      return res.send({
        status: 0,
        type: 'ERROR_MOBILE_NOT_EXIST',
        message: '该手机号尚未注册'
      });
    }

    try {
      let code = '';
      for (let i = 0;i < 6; i++) {
        code += Math.floor(Math.random() * 10);
      };

      console.log(code);

      req.session.msg_code = {
        mobile,
        code,
        time: Date.now()
      }

      res.send({ status: 1 });
    } catch (err) {
      res.send({
        status: 0,
        type: 'ERROR_GET_MSG_CAPTCHA',
        message: '获取短信验证码失败'
      });
    }
  }
}

export default new Common();