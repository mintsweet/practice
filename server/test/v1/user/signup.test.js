const app = require('../../../app').listen();
const request = require('supertest')(app);
const should = require('should');
const support = require('../../support');

describe('test /v1/signup', function() {
  before(async function() {
    await support.createUser('18800000000', '已注册用户');
  });

  after(async function() {
    await support.deleteUser('18800000000');
    await support.deleteUser('18800000001');
  });

  it('should / status 400 when the mobile is invalid', async function() {
    try {
      const res = await request.post('/v1/signup').send({
        nickname: '小明',
        password: 'a123456',
        mobile: '12345678912',
        sms: 666666
      }).expect(400);

      res.text.should.equal('手机号格式不正确');
    } catch(err) {
      should.ifError(err.message);
    }
  });

  it('should / status 400 when the password is invalid', async function() {
    try {
      const res = await request.post('/v1/signup').send({
        nickname: '小明',
        password: '123456',
        mobile: '18800000001',
        sms: 666666
      }).expect(400);

      res.text.should.equal('密码必须为数字、字母和特殊字符其中两种组成并且在6至18位之间');
    } catch(err) {
      should.ifError(err.message);
    }
  });

  it('should / status 400 when the nickname is invalid', async function() {
    try {
      const res = await request.post('/v1/signup').send({
        nickname: '小',
        password: 'a123456',
        mobile: '18800000001',
        sms: 666666
      }).expect(400);

      res.text.should.equal('昵称必须在2至8位之间');
    } catch(err) {
      should.ifError(err.message);
    }
  });

  it('should / status 400 when the sms code is not exist', async function() {
    try {
      const res = await request.post('/v1/signup').send({
        nickname: '小明',
        password: 'a123456',
        mobile: '18800000002',
        sms: 666666
      }).expect(400);

      res.text.should.equal('尚未获取短信验证码或者已经失效');
    } catch(err) {
      should.ifError(err.message);
    }
  });

  it('should / status 400 when the sms code is wrong', async function() {
    try {
      let res = await request.get('/v1/aider/sms_code').query({
        mobile: '18800000001',
        expired: 100
      }).expect(200);

      res = await request.post('/v1/signup').send({
        nickname: '小明',
        password: 'a123456',
        mobile: '18800000001',
        sms: 666666
      }).expect(400);

      res.text.should.equal('短信验证码不正确');
    } catch(err) {
      should.ifError(err.message);
    }
  });

  it('should / status 409 when the mobile is registered', async function() {
    try {
      let res = await request.get('/v1/aider/sms_code').query({
        mobile: '18800000000',
        expired: 100
      }).expect(200);

      res = await request.post('/v1/signup').send({
        nickname: '小明',
        password: 'a123456',
        mobile: '18800000000',
        sms: res.text
      }).expect(409);

      res.text.should.equal('手机号已经注册过了');
    } catch(err) {
      should.ifError(err.message);
    }
  });

  it('should / status 409 when the nickname is registered', async function() {
    try {
      let res = await request.get('/v1/aider/sms_code').query({
        mobile: '18800000001',
        expired: 100
      }).expect(200);

      res = await request.post('/v1/signup').send({
        nickname: '已注册用户',
        password: 'a123456',
        mobile: '18800000001',
        sms: res.text
      }).expect(409);

      res.text.should.equal('昵称已经注册过了');
    } catch(err) {
      should.ifError(err.message);
    }
  });

  it('should / status 200', async function() {
    try {
      const res = await request.get('/v1/aider/sms_code').query({
        mobile: '18800000001',
        expired: 100
      }).expect(200);

      await request.post('/v1/signup').send({
        nickname: '小明',
        password: 'a123456',
        mobile: '18800000001',
        sms: res.text
      }).expect(200);
    } catch(err) {
      should.ifError(err.message);
    }
  });
});
