const app = require('../../app');
const request = require('supertest').agent(app);
const should = require('should');
const support = require('../support');
const tempId = require('mongoose').Types.ObjectId();

describe('test /v1/users/:uid', function() {
  let mockUser;
  let mockUser2;

  before(async function() {
    mockUser = await support.createUser(18800000000, '已注册用户');
    mockUser2 = await support.createUser(18800000001, '访问用户');
  });

  after(async function() {
    await support.deleteUser(mockUser.mobile);
    await support.deleteUser(mockUser2.mobile);
  });

  // 错误 - 无效的ID
  it('should / status 0 when the uid is invalid', async function() {
    try {
      const res = await request.get(`/v1/user/${tempId}`);

      res.body.status.should.equal(0);
      res.body.message.should.equal('无效的ID');
    } catch(err) {
      should.ifError(err.message);
    }
  });

  // 正确 - 未登录
  it('should / status 1', async function() {
    try {
      const res = await request.get(`/v1/user/${mockUser.id}`);

      res.body.status.should.equal(1);
      res.body.data.should.have.property('id');
      res.body.data.id.should.equal(mockUser.id);
      res.body.data.follow.should.equal(false);
    } catch(err) {
      should.ifError(err.message);
    }
  });

  // 正确 - 已登录
  it('should / status 1', async function() {
    try {
      let res;

      res = await request.post('/v1/signin').send({
        mobile: mockUser2.mobile,
        password: 'a123456'
      });

      res.body.status.should.equal(1);

      res = await request.get(`/v1/user/${mockUser.id}`);

      res.body.status.should.equal(1);
      res.body.data.should.have.property('id');
      res.body.data.id.should.equal(mockUser.id);
      res.body.data.follow.should.equal(false);
    } catch(err) {
      should.ifError(err.message);
    }
  });
});
