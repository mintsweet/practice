const app = require('../../app');
const request = require('supertest').agent(app);
const should = require('should');
const support = require('../support');
const sinon = require('sinon');

describe('test /v1/forget_pass', function() {
  let clock;
  let mockUser;

  before(async function() {
    clock = sinon.useFakeTimers();
    mockUser = await support.createUser(18800000000, '已注册用户');
  });

  after(async function() {
    clock.restore();
    await support.deleteUser(mockUser.mobile);
  });

  // 错误 - 手机号格式错误
  it('shuold / status 0 when the mobile is invalid', async function() {
    try {
      const res = await request.patch('/v1/forget_pass').send({
        mobile: 12345678901,
        newPass: 'a123456789',
        smscaptcha: 123456
      });

      res.body.status.should.equal(0);
      res.body.message.should.equal('手机号格式错误');
    } catch(err) {
      should.ifError(err.message);
    }
  });

  // 错误 - 新密码格式不正确
  it('shuold / status 0 when the newPass is invalid', async function() {
    try {
      const res = await request.patch('/v1/forget_pass').send({
        mobile: 18800000000,
        newPass: '123456789',
        smscaptcha: '123456'
      });

      res.body.status.should.equal(0);
      res.body.message.should.equal('新密码必须为数字、字母和特殊字符其中两种组成并且在6-18位之间');
    } catch(err) {
      should.ifError(err.message);
    }
  });

  // 错误 - 提交手机号与获取验证码手机号不对应
  it('should / status 0 when the mobile is not match', async function() {
    try {
      let res;

      res = await request.get('/v1/aider/sms_code').query({
        mobile: 18800000001
      });

      res.body.status.should.equal(1);

      res = await request.patch('/v1/forget_pass').send({
        mobile: 18800000000,
        newPass: 'a123456789',
        smscaptcha: 123456
      });

      res.body.status.should.equal(0);
      res.body.message.should.equal('提交手机号与获取验证码手机号不对应');
    } catch(err) {
      should.ifError(err.message);
    }
  });

  // 错误 - 验证码错误
  it('should / status 0 when the sms code is wrong', async function() {
    try {
      let res;

      res = await request.get('/v1/aider/sms_code').query({
        mobile: 18800000000
      });

      res.body.status.should.equal(1);

      res = await request.patch('/v1/forget_pass').send({
        mobile: 18800000000,
        newPass: 'a123456789',
        smscaptcha: 123456
      });

      res.body.status.should.equal(0);
      res.body.message.should.equal('验证码错误');
    } catch(err) {
      should.ifError(err.message);
    }
  });

  // 错误 - 验证码失效
  it('should / status 0 when the sms code is expired', async function() {
    try {
      let res;

      res = await request.get('/v1/aider/sms_code').query({
        mobile: 18800000000,
        expired: 1000 * 60
      });

      res.body.status.should.equal(1);

      clock.tick(1000 * 61);

      res = await request.patch('/v1/forget_pass').send({
        mobile: 18800000000,
        newPass: 'a123456789',
        smscaptcha: res.body.code
      });

      res.body.status.should.equal(0);
      res.body.message.should.equal('验证码已失效，请重新获取');
    } catch(err) {
      should.ifError(err.message);
    }
  });

  // 错误 - 手机号尚未注册
  it('should / status 0 when the mobile is not signup', async function() {
    try {
      let res;

      res = await request.get('/v1/aider/sms_code').query({
        mobile: 18800000001
      });

      res.body.status.should.equal(1);

      res = await request.patch('/v1/forget_pass').send({
        mobile: 18800000001,
        newPass: 'a123456789',
        smscaptcha: res.body.code
      });

      res.body.status.should.equal(0);
      res.body.message.should.equal('尚未注册');
    } catch(err) {
      should.ifError(err.message);
    }
  });

  // 正确
  it('should / status 1', async function() {
    try {
      let res;

      res = await request.get('/v1/aider/sms_code').query({
        mobile: 18800000000
      });

      res.body.status.should.equal(1);

      res = await request.patch('/v1/forget_pass').send({
        mobile: 18800000000,
        newPass: 'a123456789',
        smscaptcha: res.body.code
      });

      res.body.status.should.equal(1);
    } catch(err) {
      should.ifError(err.message);
    }
  });
});
