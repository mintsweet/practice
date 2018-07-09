const app = require('../../app');
const request = require('supertest').agent(app);
const should = require('should');
const support = require('../support');

describe('test /api/topics/no_reply', function() {
  let mockUser;

  before(async function() {
    mockUser = await support.createUser('话题创建者', '18800000000');
    await support.createTopic(mockUser.id);
    await support.createTopic(mockUser.id);
  });

  after(async function() {
    await support.deleteUser(mockUser.mobile);
    await support.deleteTopic(mockUser.id);
  });

  // 正确 - 默认
  it('should / status 1 when the query is default', async function() {
    try {
      const res = await request.get('/api/topics/no_reply');

      res.body.status.should.equal(1);
      res.body.data.length.should.equal(2);
    } catch(err) {
      should.ifError(err.message);
    }
  });
});
