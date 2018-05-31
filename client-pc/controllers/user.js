const formidable = require('formidable');
const rq = require('request-promise');
const {
  apiGetUserTop100, apiSignin
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
