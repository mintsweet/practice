const app = require('../../app');
const request = require('supertest')(app);
const should = require('should');
const support = require('../support');

describe('test /api/user/:uid/creates', function() {
  let mockUser;
  let mockTopic;

  before(async function() {
    mockUser = await support.createUser('回复者', '18800000000');
    mockTopic = await support.createTopic(mockUser.id);
    await support.createBehavior('create', mockUser.id, mockTopic.id);
  });

  after(async function() {
    await support.deleteBehavior(mockUser.id);
    await support.deleteTopic(mockUser.id);
    await support.deleteUser(mockUser.mobile);
    mockUser = null;
    mockTopic = null;
  });

  // 正确
  it('should / status 1', async function() {
    try {
      const res = await request.get(`/api/user/${mockUser.id}/creates`);

      res.body.status.should.equal(1);
      res.body.data.should.be.Array();
      res.body.data.length.should.equal(1);
    } catch(err) {
      should.ifError(err.message);
    }
  });
});
