const app = require('../../app').listen();
const request = require('supertest')(app);
const should = require('should');
const support = require('../support');

describe('test /signup', function() {
  before(async function() {
    await support.createUser('123456@qq.com');
  });

  after(async function() {
    await support.deleteUser('123456@qq.com');
    await support.deleteUser('123457@qq.com');
  });

  it('should / status 400 when the email is invalid', async function() {
    try {
      const res = await request
        .post('/signup')
        .send({
          email: '12345678912',
          password: 'a123456',
          nickname: '小明',
        })
        .expect(400);

      res.text.should.equal('邮箱格式不正确');
    } catch (err) {
      should.ifError(err.message);
    }
  });

  it('should / status 400 when the password is invalid', async function() {
    try {
      const res = await request
        .post('/signup')
        .send({
          email: '123457@qq.com',
          nickname: '小明',
          password: '123456',
        })
        .expect(400);

      res.text.should.equal(
        '密码必须为数字、字母和特殊字符其中两种组成并且在6至18位之间',
      );
    } catch (err) {
      should.ifError(err.message);
    }
  });

  it('should / status 400 when the nickname is invalid', async function() {
    try {
      const res = await request
        .post('/signup')
        .send({
          email: '123457@qq.com',
          password: 'a123456',
          nickname: '小',
        })
        .expect(400);

      res.text.should.equal('昵称必须在2至10位之间');
    } catch (err) {
      should.ifError(err.message);
    }
  });

  it('should / status 409 when the email is registered', async function() {
    try {
      const res = await request
        .post('/signup')
        .send({
          email: '123456@qq.com',
          password: 'a123456',
          nickname: '小明',
        })
        .expect(409);

      res.text.should.equal('邮箱已经注册过了');
    } catch (err) {
      should.ifError(err.message);
    }
  });

  it('should / status 409 when the nickname is registered', async function() {
    try {
      const res = await request
        .post('/signup')
        .send({
          email: '123457@qq.com',
          password: 'a123456',
          nickname: '测试用户',
        })
        .expect(409);

      res.text.should.equal('昵称已经注册过了');
    } catch (err) {
      should.ifError(err.message);
    }
  });

  it('should / status 200', async function() {
    try {
      await request
        .post('/signup')
        .send({
          email: '123457@qq.com',
          password: 'a123456',
          nickname: '小明',
        })
        .expect(200);
    } catch (err) {
      should.ifError(err.message);
    }
  });
});
