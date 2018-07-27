const app = require('../../app');
const request = require('supertest').agent(app);
const should = require('should');
const support = require('../support');

describe('test /v1/setting', function() {
  let mockUser;
  let mockUser2;

  before(async function() {
    mockUser = await support.createUser(18800000000, '已注册用户');
    mockUser2 = await support.createUser(18800000001, '已注册用户二');
  });

  after(async function() {
    await support.deleteUser(mockUser.mobile);
    await support.deleteUser(mockUser2.mobile);
    mockUser = null;
    mockUser2 = null;
  });

  // 错误 - 尚未登录
  it('should / status 0 when user is not signin', async function() {
    try {
      const res = await request.put('/v1/setting').send({
        nickname: '青湛',
        location: '四川，成都',
        signature: '我是光'
      });

      res.body.status.should.equal(0);
      res.body.message.should.equal('尚未登录');
    } catch(err) {
      should.ifError(err.message);
    }
  });

  // 失败 - 昵称已经注册过了
  it('should / status 0 when nickname is registered', async function() {
    try {
      let res;

      res = await request.post('/v1/signin').send({
        mobile: mockUser.mobile,
        password: 'a123456'
      });

      res.body.status.should.equal(1);

      res = await request.put('/v1/setting').send({
        nickname: mockUser2.nickname,
        location: '四川，成都',
        signature: '我是光'
      });

      res.body.status.should.equal(0);
      res.body.message.should.equal('昵称已经注册过了');
    } catch(err) {
      should.ifError(err.message);
    }
  });

  // 成功
  it('should / status 1', async function() {
    try {
      let res;

      res = await request.post('/v1/signin').send({
        mobile: mockUser.mobile,
        password: 'a123456'
      });

      res.body.status.should.equal(1);

      res = await request.put('/v1/setting').send({
        nickname: '改名用户',
        location: '四川，成都',
        signature: '我是光'
      });

      res.body.status.should.equal(1);
    } catch(err) {
      should.ifError(err.message);
    }
  });
});
