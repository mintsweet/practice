const app = require('../../app');
const request = require('supertest').agent(app);
const should = require('should');
const support = require('../support');

describe('test /v1/topics/no_reply', function() {
  let mockUser;

  before(async function() {
    mockUser = await support.createUser(18800000000, '话题创建者');
    await support.createTopic(mockUser.id);
    await support.createTopic(mockUser.id);
  });

  after(async function() {
    await support.deleteTopic(mockUser.id);
    await support.deleteUser(mockUser.mobile);
    mockUser = null;
  });

  // 正确
  it('should / status 1', async function() {
    try {
      const res = await request.get('/v1/topics/no_reply');

      res.body.status.should.equal(1);
      res.body.data.length.should.equal(2);
    } catch(err) {
      should.ifError(err.message);
    }
  });
});
