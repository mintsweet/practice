const app = require('../../../app').listen();
const request = require('supertest')(app);
const should = require('should');
const support = require('../../support');

describe('test /v1/update_pass', function() {
  let mockUser;

  before(async function() {
    mockUser = await support.createUser('123456@qq.com', '已注册用户');
  });

  after(async function() {
    await support.deleteUser(mockUser.email);
  });

  it('should / status 401 when the not signin', async function() {
    try {
      const res = await request
        .patch('/v1/update_pass')
        .send({
          oldPass: 'a123456',
          newPass: 'a123456789'
        })
        .expect(401);

      res.text.should.equal('尚未登录');
    } catch(err) {
      should.ifError(err.message);
    }
  });

  it('should / status 400 when the oldPass is invalid', async function() {
    try {
      let res = await request
        .post('/v1/signin')
        .send({
          email: mockUser.email,
          password: 'a123456'
        })
        .expect(200);

      res = await request
        .patch('/v1/update_pass')
        .send({
          oldPass: '',
          newPass: 'a123456789'
        })
        .set('Authorization', res.text)
        .expect(400);

      res.text.should.equal('旧密码不能为空');
    } catch(err) {
      should.ifError(err.message);
    }
  });

  it('should / status 400 when the newPass is invalid', async function() {
    try {
      let res = await request
        .post('/v1/signin')
        .send({
          email: mockUser.email,
          password: 'a123456'
        })
        .expect(200);

      res = await request
        .patch('/v1/update_pass')
        .send({
          oldPass: 'a123456',
          newPass: '123456789'
        })
        .set('Authorization', res.text)
        .expect(400);

      res.text.should.equal('新密码必须为数字、字母和特殊字符其中两种组成并且在6-18位之间');
    } catch(err) {
      should.ifError(err.message);
    }
  });

  it('should / status 400 when the oldPass is wrong', async function() {
    try {
      let res = await request
        .post('/v1/signin')
        .send({
          email: mockUser.email,
          password: 'a123456'
        })
        .expect(200);

      res = await request
        .patch('/v1/update_pass')
        .send({
          oldPass: '123456',
          newPass: 'a123456789'
        })
        .set('Authorization', res.text)
        .expect(400);

      res.text.should.equal('旧密码错误');
    } catch(err) {
      should.ifError(err.message);
    }
  });

  it('should / status 200', async function() {
    try {
      const res = await request
        .post('/v1/signin')
        .send({
          email: mockUser.email,
          password: 'a123456'
        })
        .expect(200);

      await request
        .patch('/v1/update_pass')
        .send({
          oldPass: 'a123456',
          newPass: 'a123456789'
        })
        .set('Authorization', res.text)
        .expect(200);
    } catch(err) {
      should.ifError(err.message);
    }
  });
});
