const app = require('../../app');
const request = require('supertest').agent(app);
const should = require('should');
const support = require('../support');
const sinon = require('sinon');

describe('test /api/forget_pass', function() {
  let clock;
  let mockUser;

  before(async function() {
    clock = sinon.useFakeTimers();
    mockUser = await support.createUser('已注册用户', '18800000000');
  });

  after(async function() {
    clock.restore();
    await support.deleteUser(mockUser.mobile);
  });

  // 错误 - 手机号格式不正确
  it('shuold return status 0 when the mobile is invalid', async function() {
    try {
      const res = await request.patch('/api/forget_pass').send({
        mobile: '12345678901',
        newPassword: 'a123456789',
        smscaptcha: '123456'
      });
      res.body.status.should.equal(0);
      res.body.type.should.equal('ERROR_PARMAS_OF_FORGET_PASS');
      res.body.message.should.equal('请输入正确的手机号');
    } catch(err) {
      should.ifError(err.message);
    }
  });

  // 错误 - 新密码格式不正确
  it('shuold return status 0 when the newPassword is invalid', async function() {
    try {
      const res = await request.patch('/api/forget_pass').send({
        mobile: '18800000000',
        newPassword: '123456789',
        smscaptcha: '123456'
      });
      res.body.status.should.equal(0);
      res.body.type.should.equal('ERROR_PARMAS_OF_FORGET_PASS');
      res.body.message.should.equal('密码必须为数字、字母和特殊字符其中两种组成并且在6-18位之间');
    } catch(err) {
      should.ifError(err.message);
    }
  });

  // 错误 - 提交手机号与获取验证码手机号不对应
  it('should return status 0 when the smscaptcha and mobile is not match', async function() {
    try {
      let res;

      res = await request.get('/api/captcha/sms').query({
        mobile: '18800000001'
      });
      res.body.status.should.equal(1);
      res.body.code.length.should.equal(6);

      res = await request.patch('/api/forget_pass').send({
        mobile: '18800000000',
        newPassword: 'a123456789',
        smscaptcha: '123456'
      });
      res.body.status.should.equal(0);
      res.body.type.should.equal('ERROR_PARMAS_OF_FORGET_PASS');
      res.body.message.should.equal('提交手机号与获取验证码手机号不对应');
    } catch(err) {
      should.ifError(err.message);
    }
  });

  // 错误 - 验证码错误
  it('should return status 0 when the smscaptcha is error', async function() {
    try {
      let res;

      res = await request.get('/api/captcha/sms').query({
        mobile: '18800000000'
      });
      res.body.status.should.equal(1);
      res.body.code.length.should.equal(6);

      res = await request.patch('/api/forget_pass').send({
        mobile: '18800000000',
        newPassword: 'a123456789',
        smscaptcha: '123456'
      });
      res.body.status.should.equal(0);
      res.body.type.should.equal('ERROR_PARMAS_OF_FORGET_PASS');
      res.body.message.should.equal('验证码错误');
    } catch(err) {
      should.ifError(err.message);
    }
  });

  // 错误 - 验证码失效
  it('should return status 0 when the smscaptcha is expired', async function() {
    try {
      let res;

      res = await request.get('/api/captcha/sms').query({
        mobile: '18800000000',
        expired: 1000 * 60
      });
      res.body.status.should.equal(1);
      res.body.code.length.should.equal(6);

      clock.tick(1000 * 61);

      res = await request.patch('/api/forget_pass').send({
        mobile: '18800000000',
        newPassword: 'a123456789',
        smscaptcha: res.body.code
      });
      res.body.status.should.equal(0);
      res.body.type.should.equal('ERROR_PARMAS_OF_FORGET_PASS');
      res.body.message.should.equal('验证码已失效，请重新获取');
    } catch(err) {
      should.ifError(err.message);
    }
  });

  // 错误 - 手机号尚未注册
  it('should return status 0 when the mobile is not signup', async function() {
    try {
      let res;

      res = await request.get('/api/captcha/sms').query({
        mobile: '18800000001'
      });
      res.body.status.should.equal(1);
      res.body.code.length.should.equal(6);

      res = await request.patch('/api/forget_pass').send({
        mobile: '18800000001',
        newPassword: 'a123456789',
        smscaptcha: res.body.code
      });
      res.body.status.should.equal(0);
      res.body.type.should.equal('ERROR_USER_IS_NOT_EXITS');
      res.body.message.should.equal('尚未注册');
    } catch(err) {
      should.ifError(err.message);
    }
  });

  // 正确
  it('should return status 1', async function() {
    try {
      let res;

      res = await request.get('/api/captcha/sms').query({
        mobile: '18800000000'
      });
      res.body.status.should.equal(1);
      res.body.code.length.should.equal(6);

      res = await request.patch('/api/forget_pass').send({
        mobile: '18800000000',
        newPassword: 'a123456789',
        smscaptcha: res.body.code
      });
      res.body.status.should.equal(1);
    } catch(err) {
      should.ifError(err.message);
    }
  });
});
