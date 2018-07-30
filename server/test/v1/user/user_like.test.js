const app = require('../../app');
const request = require('supertest')(app);
const should = require('should');
const support = require('../support');

describe('test /v1/user/:uid/like', function() {
  let mockUser;
  let mockTopic;

  before(async function() {
    mockUser = await support.createUser(18800000000, '已经注册者');
    mockTopic = await support.createTopic(mockUser.id);
    await support.createAction('like', mockUser.id, mockTopic.id);
  });

  after(async function() {
    await support.deleteAction(mockUser.id);
    await support.deleteTopic(mockUser.id);
    await support.deleteUser(mockUser.mobile);
    mockUser = null;
    mockTopic = null;
  });

  // 正确
  it('should / status 1', async function() {
    try {
      const res = await request.get(`/v1/user/${mockUser.id}/like`);

      res.body.status.should.equal(1);
      res.body.data.should.be.Array();
      res.body.data.length.should.equal(1);
    } catch(err) {
      should.ifError(err.message);
    }
  });
});
