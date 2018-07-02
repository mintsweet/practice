const app = require('../../app');
const request = require('supertest').agent(app);
const should = require('should');
const support = require('../support');
const tempId = require('mongoose').Types.ObjectId();

describe('test /api/topic/:tid', function() {
  let mockUser;
  let mockTopic;

  before(async function() {
    mockUser = await support.createUser('话题创建者', '18800000000');
    mockTopic = await support.createTopic(mockUser.id);
    await support.createReply(mockUser.id, mockTopic.id);
  });

  after(async function() {
    await support.deleteUser(mockUser.mobile);
    await support.deleteTopic(mockUser.id);
    await support.deleteReply(mockTopic.id);
    mockUser = null;
    mockTopic = null;
  });

  // 错误 - 无效的ID
  it('should return status 0 when the tid is invalid', async function() {
    try {
      const res = await request.get(`/api/topic/${tempId}`);
      res.body.status.should.equal(0);
      res.body.type.should.equal('ERROR_ID_IS_INVALID');
      res.body.message.should.equal('无效的ID');
    } catch(err) {
      should.ifError(err.message);
    }
  });

  // 正确
  it('should return status 1', async function() {
    try {
      const res = await request.get(`/api/topic/${mockTopic.id}`);
      res.body.status.should.equal(1);
    } catch(err) {
      should.ifError(err.message);
    }
  });
});
