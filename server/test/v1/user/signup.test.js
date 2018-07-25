const app = require('../../../app').listen();
const request = require('supertest')(app);
const should = require('should');
const support = require('../../support');

describe('test /v1/user/signup', function() {
  before(async function() {
    await support.createUser(18800000000, '已经注册的用户');
  });

  after(async function() {
    await support.deleteUser(18800000000);
    await support.deleteUser(18800000001);
  });

  it('should / 400 when the mobile is invalid', async function() {
    try {
      const res = await request.post('/v1/signup').send({
        nickname: '小明',
        password: 'a123456',
        mobile: 12345678912,
        smscaptcha: 666666
      });

      res.status.should.equal(400);
      res.error.text.should.equal('手机号格式不正确');
    } catch(err) {
      should.ifError(err.message);
    }
  });

  it('should / 400 when the password is invalid', async function() {
    try {
      const res = await request.post('/v1/signup').send({
        nickname: '小明',
        password: '123456',
        mobile: 18800000001,
        smscaptcha: 666666
      });

      res.status.should.equal(400);
      res.error.text.should.equal('密码必须为数字、字母和特殊字符其中两种组成并且在6至18位之间');
    } catch(err) {
      should.ifError(err.message);
    }
  });

  it('should / 400 when the nickname is invalid', async function() {
    try {
      const res = await request.post('/v1/signup').send({
        nickname: '小',
        password: 'a123456',
        mobile: 18800000001,
        smscaptcha: 666666
      });

      res.status.should.equal(400);
      res.error.text.should.equal('昵称必须在2至8位之间');
    } catch(err) {
      should.ifError(err.message);
    }
  });

  it('should / 400 when the sms is not exist or expired', async function() {
    try {
      const res = await request.post('/v1/signup').send({
        nickname: '小明',
        password: 'a123456',
        mobile: 18800000002,
        smscaptcha: 666666
      });

      res.status.should.equal(400);
      res.error.text.should.equal('尚未获取短信验证码或者已经失效');
    } catch(err) {
      should.ifError(err.message);
    }
  });

  it('should / 400 when the sms is wrong', async function() {
    try {
      let res;

      res = await request.get('/v1/captcha/sms').query({
        mobile: 18800000001
      });

      res.text.length.should.equal(6);

      res = await request.post('/v1/signup').send({
        nickname: '小明',
        password: 'a123456',
        mobile: 18800000001,
        smscaptcha: 666666
      });

      res.status.should.equal(400);
      res.error.text.should.equal('短信验证码不正确');
    } catch(err) {
      should.ifError(err.message);
    }
  });

  it('should / 400 when the mobile is registered', async function() {
    try {
      let res;

      res = await request.get('/v1/captcha/sms').query({
        mobile: 18800000000
      });

      res.text.length.should.equal(6);

      res = await request.post('/v1/signup').send({
        nickname: '小明',
        password: 'a123456',
        mobile: 18800000000,
        smscaptcha: res.text
      });

      res.status.should.equal(400);
      res.error.text.should.equal('手机号已经注册过了');
    } catch(err) {
      should.ifError(err.message);
    }
  });

  it('should / 400 when the nickname is registered', async function() {
    try {
      let res;

      res = await request.get('/v1/captcha/sms').query({
        mobile: 18800000001,
      });

      res.text.length.should.equal(6);

      res = await request.post('/v1/signup').send({
        nickname: '已经注册的用户',
        password: 'a123456',
        mobile: 18800000001,
        smscaptcha: res.text
      });

      // console.log(res);

      res.status.should.equal(400);
      res.error.text.should.equal('昵称已经注册过了');
    } catch(err) {
      should.ifError(err.message);
    }
  });

  it('should / 200', async function() {
    try {
      let res;

      res = await request.get('/v1/captcha/sms').query({
        mobile: 18800000001,
      });

      res.text.length.should.equal(6);

      res = await request.post('/v1/signup').send({
        nickname: '小明',
        password: 'a123456',
        mobile: 18800000001,
        smscaptcha: res.text
      });

      res.status.should.equal(200);
    } catch(err) {
      should.ifError(err.message);
    }
  });
});
