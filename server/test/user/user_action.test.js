const app = require('../../app');
const request = require('supertest')(app);
const should = require('should');
const support = require('../support');

describe('test /v1/user/:uid/action', function() {
  let mockUser;
  let mockUser2;
  let mockTopic;

  before(async function() {
    mockUser = await support.createUser(18800000000, '行为发起者');
    mockUser2 = await support.createUser(18800000001, '行为无关者');
    mockTopic = await support.createTopic(mockUser.id);
    await support.createAction('like', mockUser.id, mockTopic.id);
    await support.createAction('follow', mockUser.id, mockUser2.id);
  });

  after(async function() {
    await support.deleteAction(mockUser.id);
    await support.deleteTopic(mockUser.id);
    await support.deleteUser(mockUser.mobile);
    await support.deleteUser(mockUser2.mobile);
    mockTopic = null;
    mockUser = null;
    mockUser2 = null;
  });

  // 正确
  it('should / status 1', async function() {
    try {
      const res = await request.get(`/v1/user/${mockUser.id}/action`);

      res.body.status.should.equal(1);
      res.body.data.should.be.Array();
      res.body.data.length.should.equal(2);
    } catch(err) {
      should.ifError(err.message);
    }
  });
});
