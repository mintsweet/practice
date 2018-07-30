const app = require('../../app');
const request = require('supertest').agent(app);
const should = require('should');
const support = require('../support');

describe('test /v1/update_pass', function() {
  let mockUser;

  before(async function() {
    mockUser = await support.createUser(18800000000, '已注册用户');
  });

  after(async function() {
    await support.deleteUser(mockUser.mobile);
  });

  // 错误 - 尚未登录
  it('should / status 0 when the not signin', async function() {
    try {
      const res = await request.patch('/v1/update_pass').send({
        oldPass: 'a123456',
        newPass: 'a123456789'
      });

      res.body.status.should.equal(0);
      res.body.message.should.equal('尚未登录');
    } catch(err) {
      should.ifError(err.message);
    }
  });

  // 错误 - 旧密码不能为空
  it('should / status 0 when the oldPass is invalid', async function() {
    try {
      let res;

      res = await request.post('/v1/signin').send({
        mobile: mockUser.mobile,
        password: 'a123456'
      });

      res.body.status.should.equal(1);

      res = await request.patch('/v1/update_pass').send({
        oldPass: '',
        newPass: 'a123456789'
      });

      res.body.status.should.equal(0);
      res.body.message.should.equal('旧密码不能为空');
    } catch(err) {
      should.ifError(err.message);
    }
  });

  // 错误 - 新密码不能通过校验
  it('should / status 0 when the newPass is invalid', async function() {
    try {
      let res;

      res = await request.post('/v1/signin').send({
        mobile: mockUser.mobile,
        password: 'a123456'
      });

      res.body.status.should.equal(1);

      res = await request.patch('/v1/update_pass').send({
        oldPass: 'a123456',
        newPass: '123456789'
      });

      res.body.status.should.equal(0);
      res.body.message.should.equal('新密码必须为数字、字母和特殊字符其中两种组成并且在6-18位之间');
    } catch(err) {
      should.ifError(err.message);
    }
  });

  // 错误 - 旧密码错误
  it('should / status 0 when the oldPass is not match', async function() {
    try {
      let res;

      res = await request.post('/v1/signin').send({
        mobile: mockUser.mobile,
        password: 'a123456'
      });

      res.body.status.should.equal(1);

      res = await request.patch('/v1/update_pass').send({
        oldPass: '123456',
        newPass: 'a123456789'
      });

      res.body.status.should.equal(0);
      res.body.message.should.equal('旧密码错误');
    } catch(err) {
      should.ifError(err.message);
    }
  });

  // 正确
  it('should / status 1', async function() {
    try {
      let res;

      res = await request.post('/v1/signin').send({
        mobile: mockUser.mobile,
        password: 'a123456'
      });

      res.body.status.should.equal(1);

      res = await request.patch('/v1/update_pass').send({
        oldPass: 'a123456',
        newPass: 'a123456789'
      });

      res.body.status.should.equal(1);
    } catch(err) {
      should.ifError(err.message);
    }
  });
});
