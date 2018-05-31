const formidable = require('formidable');
const rq = require('request-promise');
const {
  apiGetUserTop100, apiSignin, apiGetUserInfo
} = require('../service/api');

exports.getUserTop100 = async () => {
  const res = await apiGetUserTop100();
  if (res.status === 1) {
    return res.data;
  } else {
    return [];
  }
}

exports.renderSignin = (req, res) => {
  res.render('signin', {
    title: '登录'
  });
}

exports.signin = (req, res) => {
  const form = new formidable.IncomingForm();
  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.render('signin', {
        title: '登录',
        error: '参数解析失败'
      });
    }

    const { mobile, password } = fields;

    try {
      if (!mobile || !/^1[3,5,7,8,9]\d{9}$/.test(mobile)) {
        throw new Error('请输入正确的手机号');
      } else if (!password) {
        throw new Error('密码不能为空');
      }
    } catch(err) {
      return res.render('signin', {
        title: '登录',
        error: err.message
      });
    }

    const restRes = await apiSignin({
      mobile,
      password,
      type: 'acc'
    });

    if (restRes.status === 1) {
      return res.redirect('/');
    } else {
      return res.render('signin', {
        title: '登录',
        error: restRes.message
      });
    }
  });
}
