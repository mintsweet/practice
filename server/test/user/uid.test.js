const app = require('../../app');
const request = require('supertest')(app);
const should = require('should');
const support = require('../support');
const tempId = require('mongoose').Types.ObjectId();

describe('test /api/users/:uid', function() {
  let mockUser;

  before(async function() {
    mockUser = await support.createUser('已注册用户', '18800000000');
  });

  after(async function() {
    await support.deleteUser(mockUser.mobile);
  });

  // 错误 - 无效的ID
  it('should / status 0 when the uid is invalid', async function() {
    try {
      const res = await request.get(`/api/user/${tempId}`);

      res.body.status.should.equal(0);
      res.body.type.should.equal('ERROR_ID_IS_INVALID');
      res.body.message.should.equal('无效的ID');
    } catch(err) {
      should.ifError(err.message);
    }
  });

  // 正确
  it('should / status 1', async function() {
    try {
      const res = await request.get(`/api/user/${mockUser.id}`);

      res.body.status.should.equal(1);
      res.body.data.should.have.property('id');
      res.body.data.id.should.equal(mockUser.id);
      res.body.follow.should.equal(false);
    } catch(err) {
      should.ifError(err.message);
    }
  });
});
