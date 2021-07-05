const app = require('../../app').listen();
const request = require('supertest')(app);
const should = require('should');
const support = require('../support');

describe('test /password', function() {
  let mockUser;

  before(async function() {
    mockUser = await support.createUser('123456@qq.com');
  });

  after(async function() {
    await support.deleteUser(mockUser.email);
  });

  it('should / status 401 when the not signin', async function() {
    try {
      const res = await request
        .put('/password')
        .send({
          old_pass: 'a123456',
          new_pass: 'a123456789',
        })
        .expect(401);

      res.text.should.equal('尚未登录');
    } catch (err) {
      should.ifError(err.message);
    }
  });

  it('should / status 400 when the old_pass is invalid', async function() {
    try {
      let res = await request
        .post('/signin')
        .send({
          email: mockUser.email,
          password: 'a123456',
        })
        .expect(200);

      res = await request
        .put('/password')
        .send({
          old_pass: '',
          new_pass: 'a123456789',
        })
        .set('Authorization', res.text)
        .expect(400);

      res.text.should.equal('旧密码不能为空');
    } catch (err) {
      should.ifError(err.message);
    }
  });

  it('should / status 400 when the new_pass is invalid', async function() {
    try {
      let res = await request
        .post('/signin')
        .send({
          email: mockUser.email,
          password: 'a123456',
        })
        .expect(200);

      res = await request
        .put('/password')
        .send({
          old_pass: 'a123456',
          new_pass: '123456789',
        })
        .set('Authorization', res.text)
        .expect(400);

      res.text.should.equal(
        '新密码必须为数字、字母和特殊字符其中两种组成并且在6-18位之间',
      );
    } catch (err) {
      should.ifError(err.message);
    }
  });

  it('should / status 400 when the old_pass is wrong', async function() {
    try {
      let res = await request
        .post('/signin')
        .send({
          email: mockUser.email,
          password: 'a123456',
        })
        .expect(200);

      res = await request
        .put('/password')
        .send({
          old_pass: '123456',
          new_pass: 'a123456789',
        })
        .set('Authorization', res.text)
        .expect(400);

      res.text.should.equal('旧密码错误');
    } catch (err) {
      should.ifError(err.message);
    }
  });

  it('should / status 200', async function() {
    try {
      const res = await request
        .post('/signin')
        .send({
          email: mockUser.email,
          password: 'a123456',
        })
        .expect(200);

      await request
        .put('/password')
        .send({
          old_pass: 'a123456',
          new_pass: 'a123456789',
        })
        .set('Authorization', res.text)
        .expect(200);
    } catch (err) {
      should.ifError(err.message);
    }
  });
});
