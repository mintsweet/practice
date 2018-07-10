const app = require('../../app');
const request = require('supertest')(app);
const should = require('should');
const support = require('../support');

describe('test /api/user/:uid/behaviors', function() {
  let mockUser;
  let mockUser2;
  let mockTopic;
  let mockReply;

  before(async function() {
    mockUser = await support.createUser('行为发起者', '18800000000');
    mockUser2 = await support.createUser('行为无关者', '18800000001');
    mockTopic = await support.createTopic(mockUser.id);
    mockReply = await support.createReply(mockUser.id, mockTopic.id);
    await support.createBehavior('star', mockUser.id, mockTopic.id);
    await support.createBehavior('follow', mockUser.id, mockUser2.id);
    await support.createBehavior('up', mockUser.id, mockReply.id);
  });

  after(async function() {
    await support.deleteBehavior(mockUser.id);
    await support.deleteReply(mockTopic.id);
    await support.deleteTopic(mockUser.id);
    await support.deleteUser(mockUser.mobile);
    await support.deleteUser(mockUser2.mobile);
    mockTopic = null;
    mockUser = null;
    mockUser2 = null;
    mockReply = null;
  });

  // 正确
  it('should / status 1', async function() {
    try {
      const res = await request.get(`/api/user/${mockUser.id}/behaviors`);

      res.body.status.should.equal(1);
      res.body.data.should.be.Array();
      res.body.data.length.should.equal(3);
    } catch(err) {
      should.ifError(err.message);
    }
  });
});
