const app = require('../../app');
const request = require('supertest').agent(app);
const should = require('should');
const support = require('../support');
const sinon = require('sinon');

describe('test /v1/signin', function() {
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
  it('should / status 0 when the mobile is invalid', async function() {
    try {
      const res = await request.post('/v1/signin').send({
        mobile: 12345678901,
        password: 'a123456'
      });

      res.body.status.should.equal(0);
      res.body.message.should.equal('手机号格式错误');
    } catch(err) {
      should.ifError(err.message);
    }
  });

  // 错误 - 账户不存在
  it('should / status 0 when the mobile is not registered', async function() {
    try {
      const res = await request.post('/v1/signin').send({
        mobile: 18800000001,
        password: 'a123456'
      });

      res.body.status.should.equal(0);
      res.body.message.should.equal('尚未注册');
    } catch(err) {
      should.ifError(err.message);
    }
  });

  // 登录类型为账户密码 - 密码错误
  it('should / status 0 when the pass is not match', async function() {
    try {
      const res = await request.post('/v1/signin').send({
        mobile: 18800000000,
        password: 'a123456789'
      });

      res.body.status.should.equal(0);
      res.body.message.should.equal('用户密码错误');
    } catch(err) {
      should.ifError(err.message);
    }
  });

  // 登录类型为账户密码 - 正确
  it('should / status 1', async function() {
    try {
      const res = await request.post('/v1/signin').send({
        mobile: 18800000000,
        password: 'a123456'
      });

      res.body.status.should.equal(1);
    } catch(err) {
      should.ifError(err.message);
    }
  });

  // 登录类型为短信验证码 - 收取验证码手机与登录手机不匹配
  it('should / status 0 when the mobile is not match', async function() {
    try {
      let res;

      res = await request.get('/v1/aider/sms_code').query({
        mobile: 18800000001
      });

      res.body.status.should.equal(1);

      res = await request.post('/v1/signin').send({
        issms: true,
        mobile: 18800000000,
        smscaptcha: 123456
      });

      res.body.status.should.equal(0);
      res.body.message.should.equal('收取验证码的手机与登录手机不匹配');
    } catch(err) {
      should.ifError(err.message);
    }
  });

  // 登录类型为短信验证码 - 短信验证码不对
  it('should / status 0 when the smscaptcha is invalid', async function() {
    try {
      let res;

      res = await request.get('/v1/aider/sms_code').query({
        mobile: 18800000000
      });

      res.body.status.should.equal(1);

      res = await request.post('/v1/signin').send({
        issms: true,
        mobile: 18800000000,
        smscaptcha: 123456
      });

      res.body.status.should.equal(0);
      res.body.message.should.equal('短信验证码不正确');
    } catch(err) {
      should.ifError(err.message);
    }
  });

  // 登录类型为短信验证码 - 短信验证码失效
  it('should return status 0 when the smscaptcha is expired', async function() {
    try {
      let res;

      res = await request.get('/v1/aider/sms_code').query({
        mobile: 18800000000,
        expired: 1000 * 60
      });

      res.body.status.should.equal(1);

      clock.tick(1000 * 61);

      res = await request.post('/v1/signin').send({
        issms: true,
        mobile: 18800000000,
        smscaptcha: res.body.code
      });

      res.body.status.should.equal(0);
      res.body.message.should.equal('短信验证码已经失效了，请重新获取');
    } catch(err) {
      should.ifError(err.message);
    }
  });

  // 登录类型为短信验证码 - 登录成功
  it('should return status 1', async function() {
    try {
      let res;

      res = await request.get('/v1/aider/sms_code').query({
        mobile: 18800000000
      });

      res.body.status.should.equal(1);

      res = await request.post('/v1/signin').send({
        issms: true,
        mobile: 18800000000,
        smscaptcha: res.body.code
      });

      res.body.status.should.equal(1);
    } catch(err) {
      should.ifError(err.message);
    }
  });
});
