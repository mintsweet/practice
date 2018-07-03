const app = require('../../app');
const request = require('supertest').agent(app);
const should = require('should');
const support = require('../support');
const sinon = require('sinon');

describe('test /api/signup', function() {
  let clock;

  before(async function() {
    clock = sinon.useFakeTimers();
    await support.createUser('已注册用户', '18800000000');
  });

  after(async function() {
    clock.restore();
    await support.deleteUser('18800000000');
    await support.deleteUser('18800000001');
  });

  // 错误 - 手机号验证失败
  it('should return status 0 when the mobile is not valid', async function() {
    try {
      const res = await request.post('/api/signup').send({
        nickname: '小明',
        password: 'a123456',
        mobile: '12345678912',
        smscaptcha: '666666'
      });
      res.body.status.should.equal(0);
      res.body.type.should.equal('ERROR_PARMAS_OF_SIGNUP');
      res.body.message.should.equal('请输入正确的手机号');
    } catch(err) {
      should.ifError(err.message);
    }
  });

  // 错误 - 密码验证失败
  it('should return status 0 when the password is not valid', async function() {
    try {
      const res = await request.post('/api/signup').send({
        nickname: '小明',
        password: '123456',
        mobile: '18800000001',
        smscaptcha: '666666'
      });

      res.body.status.should.equal(0);
      res.body.type.should.equal('ERROR_PARMAS_OF_SIGNUP');
      res.body.message.should.equal('密码必须为数字、字母和特殊字符其中两种组成并且在6-18位之间');
    } catch(err) {
      should.ifError(err.message);
    }
  });

  // 错误 - 昵称验证失败
  it('should return status 0 when the nickname is not valid', async function() {
    try {
      const res = await request.post('/api/signup').send({
        nickname: '小',
        password: 'a123456',
        mobile: '18800000001',
        smscaptcha: '666666'
      });
      res.body.status.should.equal(0);
      res.body.type.should.equal('ERROR_PARMAS_OF_SIGNUP');
      res.body.message.should.equal('请输入2-8位的昵称');
    } catch(err) {
      should.ifError(err.message);
    }
  });

  // 错误 - 接收短信验证码的手机与填写的手机不匹配
  it('should return status 0 when the smscaptcha and mobile not match', async function() {
    try {
      let res;

      res = await request.get('/api/captcha/sms').query({
        mobile: '18800000001',
        expired: 1000
      });
      res.body.status.should.equal(1);

      res = await request.post('/api/signup').send({
        nickname: '小明',
        password: 'a123456',
        mobile: '18800000002',
        smscaptcha: '666666'
      });

      res.body.status.should.equal(0);
      res.body.type.should.equal('ERROR_PARMAS_OF_SIGNUP');
      res.body.message.should.equal('收取验证码的手机与登录手机不匹配');
    } catch(err) {
      should.ifError(err.message);
    }
  });

  // 错误 - 短信验证码不正确
  it('should return status 0 when the smscaptcha is invalid', async function() {
    try {
      let res;

      res = await request.get('/api/captcha/sms').query({
        mobile: '18800000001',
        expired: 1000
      });
      res.body.status.should.equal(1);

      res = await request.post('/api/signup').send({
        nickname: '小明',
        password: 'a123456',
        mobile: '18800000001',
        smscaptcha: '666666'
      });
      res.body.status.should.equal(0);
      res.body.type.should.equal('ERROR_PARMAS_OF_SIGNUP');
      res.body.message.should.equal('短信验证码不正确');
    } catch(err) {
      should.ifError(err.message);
    }
  });

  // 错误 - 验证码过期
  it('should return status 0 when the smscaptcha expired', async function() {
    try {
      let res;

      res = await request.get('/api/captcha/sms').query({
        mobile: '18800000001',
        expired: 1000 * 60
      });
      res.body.status.should.equal(1);

      clock.tick(1000 * 61);

      res = await request.post('/api/signup').send({
        nickname: '小明',
        password: 'a123456',
        mobile: '18800000001',
        smscaptcha: res.body.code
      });
      res.body.status.should.equal(0);
      res.body.type.should.equal('ERROR_PARMAS_OF_SIGNUP');
      res.body.message.should.equal('短信验证码已经失效了，请重新获取');
    } catch(err) {
      should.ifError(err.message);
    }
  });

  // 错误 - 手机号已经注册
  it('should return status 0 when the mobile is registered', async function() {
    try {
      let res;

      res = await request.get('/api/captcha/sms').query({
        mobile: '18800000000',
        expired: 1000
      });
      res.body.status.should.equal(1);

      res = await request.post('/api/signup').send({
        nickname: '小明',
        password: 'a123456',
        mobile: '18800000000',
        smscaptcha: res.body.code
      });
      res.body.status.should.equal(0);
      res.body.type.should.equal('MOBILE_HAS_BEEN_REGISTERED');
      res.body.message.should.equal('手机号已经注册过了');
    } catch(err) {
      should.ifError(err.message);
    }
  });

  // 错误 - 昵称已经注册
  it('should return status 0 when the nickname is registered', async function() {
    try {
      let res;

      res = await request.get('/api/captcha/sms').query({
        mobile: '18800000001',
        expired: 1000
      });
      res.body.status.should.equal(1);

      res = await request.post('/api/signup').send({
        nickname: '已注册用户',
        password: 'a123456',
        mobile: '18800000001',
        smscaptcha: res.body.code
      });
      res.body.status.should.equal(0);
      res.body.type.should.equal('NICKNAME_HAS_BEEN_REGISTERED');
      res.body.message.should.equal('昵称已经注册过了');
    } catch(err) {
      should.ifError(err.message);
    }
  });

  // 正确
  it('should return status 1', async function() {
    try {
      let res;

      res = await request.get('/api/captcha/sms').query({
        mobile: '18800000001',
        expired: 1000
      });
      res.body.status.should.equal(1);

      res = await request.post('/api/signup').send({
        nickname: '小明',
        password: 'a123456',
        mobile: '18800000001',
        smscaptcha: res.body.code
      });

      res.body.status.should.equal(1);
    } catch(err) {
      should.ifError(err.message);
    }
  });
});
