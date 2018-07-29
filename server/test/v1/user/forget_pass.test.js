const app = require('../../../app').listen();
const request = require('supertest')(app);
const should = require('should');
const support = require('../../support');

describe('test /v1/forget_pass', function() {
  let mockUser;

  before(async function() {
    mockUser = await support.createUser(18800000000, '已注册用户');
  });

  after(async function() {
    await support.deleteUser(mockUser.mobile);
  });

  it('shuold / status 400 when the mobile is invalid', async function() {
    try {
      const res = await request.patch('/v1/forget_pass').send({
        mobile: 12345678901,
        newPass: 'a123456789',
        smscaptcha: 123456
      });

      res.status.should.equal(400);
      res.error.text.should.equal('手机号格式不正确');
    } catch(err) {
      should.ifError(err.message);
    }
  });

  it('shuold / status 400 when the newPass is invalid', async function() {
    try {
      const res = await request.patch('/v1/forget_pass').send({
        mobile: 18800000000,
        newPass: '123456789',
        smscaptcha: '123456'
      });

      res.status.should.equal(400);
      res.error.text.should.equal('新密码必须为数字、字母和特殊字符其中两种组成并且在6-18位之间');
    } catch(err) {
      should.ifError(err.message);
    }
  });

  it('should / status 400 when the sms_code is not exist', async function() {
    try {
      let res;

      res = await request.get('/v1/aider/sms_code').query({
        mobile: 18800000001,
        expired: 1000
      });

      res.status.should.equal(200);

      res = await request.patch('/v1/forget_pass').send({
        mobile: 18800000000,
        newPass: 'a123456789',
        smscaptcha: 123456
      });

      res.status.should.equal(400);
      res.error.text.should.equal('尚未获取短信验证码或者已经失效');
    } catch(err) {
      should.ifError(err.message);
    }
  });

  it('should / status 400 when the sms code is wrong', async function() {
    try {
      let res;

      res = await request.get('/v1/aider/sms_code').query({
        mobile: 18800000000,
        expired: 1000
      });

      res.status.should.equal(200);

      res = await request.patch('/v1/forget_pass').send({
        mobile: 18800000000,
        newPass: 'a123456789',
        smscaptcha: 123456
      });

      res.status.should.equal(400);
      res.error.text.should.equal('短信验证码不正确');
    } catch(err) {
      should.ifError(err.message);
    }
  });

  it('should / status 410 when the mobile is not signup', async function() {
    try {
      let res;

      res = await request.get('/v1/aider/sms_code').query({
        mobile: 18800000001,
        expired: 1000
      });

      res.status.should.equal(200);

      res = await request.patch('/v1/forget_pass').send({
        mobile: 18800000001,
        newPass: 'a123456789',
        smscaptcha: res.text
      });

      res.status.should.equal(410);
      res.error.text.should.equal('尚未注册');
    } catch(err) {
      should.ifError(err.message);
    }
  });

  it('should / status 200', async function() {
    try {
      let res;

      res = await request.get('/v1/aider/sms_code').query({
        mobile: 18800000000,
        expired: 1000
      });

      res.status.should.equal(200);

      res = await request.patch('/v1/forget_pass').send({
        mobile: 18800000000,
        newPass: 'a123456789',
        smscaptcha: res.text
      });

      res.status.should.equal(200);
    } catch(err) {
      should.ifError(err.message);
    }
  });
});
