const app = require('../../app');
const request = require('supertest')(app);
const should = require('should');
const support = require('../support');

describe('test /api/user/:uid/following', function() {
  let mockUser;
  let mockUser2;

  before(async function() {
    mockUser = await support.createUser('被关注者', '18800000000');
    mockUser2 = await support.createUser('关注者', '18800000001');
    await support.createBehavior('follow', mockUser2.id, mockUser.id);
  });

  after(async function() {
    await support.deleteBehavior(mockUser2.id);
    await support.deleteUser(mockUser.mobile);
    await support.deleteUser(mockUser2.mobile);
    mockUser = null;
    mockUser2 = null;
  });

  // 正确
  it('should / status 1', async function() {
    try {
      const res = await request.get(`/api/user/${mockUser2.id}/following`);

      res.body.status.should.equal(1);
      res.body.data.should.be.Array();
      res.body.data.length.should.equal(1);
    } catch(err) {
      should.ifError(err.message);
    }
  });
});
