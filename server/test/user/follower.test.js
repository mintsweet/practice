const app = require('../../app');
const request = require('supertest')(app);
const should = require('should');
const support = require('../support');

describe('test /api/user/:uid/follower', function() {
  let mockUser;

  before(async function() {
    mockUser = await support.createUser('已经注册者', '18800000000');
  });

  after(async function() {
    await support.deleteUser(mockUser.mobile);
    mockUser = null;
  });

  // 正确
  it('should return status 1', async function() {
    try {
      const res = await request.get(`/api/user/${mockUser.id}/follower`);
      res.body.status.should.equal(1);
      res.body.data.should.be.Array();
      res.body.data.length.should.equal(0);
    } catch(err) {
      should.ifError(err.message);
    }
  });
});
