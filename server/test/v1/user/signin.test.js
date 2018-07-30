const app = require('../../../app').listen();
const request = require('supertest')(app);
const should = require('should');
const support = require('../../support');

describe('test /v1/signin', function() {
  let mockUser;

  before(async function() {
    mockUser = await support.createUser('18800000000', '已注册用户');
  });

  after(async function() {
    await support.deleteUser(mockUser.mobile);
  });

  it('should / status 400 when the mobile is invalid', async function() {
    try {
      const res = await request.post('/v1/signin').send({
        mobile: '12345678901',
        password: 'a123456'
      }).expect(400);

      res.text.should.equal('手机号格式错误');
    } catch(err) {
      should.ifError(err.message);
    }
  });

  it('should / status 410 when the user is not exist', async function() {
    try {
      const res = await request.post('/v1/signin').send({
        mobile: '18800000001',
        password: 'a123456'
      }).expect(410);

      res.text.should.equal('尚未注册');
    } catch(err) {
      should.ifError(err.message);
    }
  });

  it('should / status 400 when the password is not match', async function() {
    try {
      const res = await request.post('/v1/signin').send({
        mobile: '18800000000',
        password: 'a123456789'
      }).expect(400);

      res.text.should.equal('密码错误');
    } catch(err) {
      should.ifError(err.message);
    }
  });

  it('should / status 200', async function() {
    try {
      await request.post('/v1/signin').send({
        mobile: '18800000000',
        password: 'a123456'
      }).expect(200);
    } catch(err) {
      should.ifError(err.message);
    }
  });

  it('should / status 400 when the sms code is not exist', async function() {
    try {
      const res = await request.post('/v1/signin').send({
        mobile: '18800000000',
        sms: '123456',
        issms: true,
      }).expect(400);

      res.text.should.equal('尚未获取短信验证码或者已经失效');
    } catch(err) {
      should.ifError(err.message);
    }
  });

  it('should / status 400 when the sms code is wrong', async function() {
    try {
      let res = await request.get('/v1/aider/sms_code').query({
        mobile: '18800000000',
        expired: 100
      }).expect(200);

      res = await request.post('/v1/signin').send({
        mobile: '18800000000',
        issms: true,
        sms: '666666'
      }).expect(400);

      res.text.should.equal('短信验证码不正确');
    } catch(err) {
      should.ifError(err.message);
    }
  });

  it('should / status 200', async function() {
    try {
      const res = await request.get('/v1/aider/sms_code').query({
        mobile: '18800000000',
        expired: 100
      }).expect(200);

      await request.post('/v1/signin').send({
        issms: true,
        mobile: '18800000000',
        sms: res.text
      }).expect(200);
    } catch(err) {
      should.ifError(err.message);
    }
  });
});
