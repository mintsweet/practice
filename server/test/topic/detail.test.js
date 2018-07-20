const app = require('../../app');
const request = require('supertest').agent(app);
const should = require('should');
const support = require('../support');
const tempId = require('mongoose').Types.ObjectId();

describe('test /api/topic/:tid', function() {
  let mockUser;
  let mockUser2;
  let mockTopic;

  before(async function() {
    mockUser = await support.createUser('话题创建者', '18800000000');
    mockUser2 = await support.createUser('话题访问者', '18800000001');
    mockTopic = await support.createTopic(mockUser.id);
    await support.createReply(mockUser.id, mockTopic.id);
  });

  after(async function() {
    await support.deleteUser(mockUser.mobile);
    await support.deleteUser(mockUser2.mobile);
    await support.deleteTopic(mockUser.id);
    await support.deleteReply(mockTopic.id);
    mockUser = null;
    mockUser2 = null;
    mockTopic = null;
  });

  // 错误 - 无效的ID
  it('should / status 0 when the tid is invalid', async function() {
    try {
      const res = await request.get(`/api/topic/${tempId}`);

      res.body.status.should.equal(0);
      res.body.type.should.equal('ERROR_ID_IS_INVALID');
      res.body.message.should.equal('无效的ID');
    } catch(err) {
      should.ifError(err.message);
    }
  });

  // 正确 - 未登录
  it('should / status 1', async function() {
    try {
      const res = await request.get(`/api/topic/${mockTopic.id}`);

      res.body.status.should.equal(1);
      res.body.data.author.id.should.equal(mockUser.id);
      res.body.data.replies.length.should.equal(1);
      res.body.data.star.should.equal(false);
      res.body.data.collect.should.equal(false);
    } catch(err) {
      should.ifError(err.message);
    }
  });

  // 正确 - 登录后
  it('should / status 1', async function() {
    try {
      let res;

      res = await request.post('/api/signin').send({
        mobile: mockUser2.mobile,
        password: 'a123456'
      });

      res.body.status.should.equal(1);
      res.body.data.should.have.property('id');
      res.body.data.id.should.equal(mockUser2.id);

      res = await request.get(`/api/topic/${mockTopic.id}`);

      res.body.status.should.equal(1);
      res.body.data.author.id.should.equal(mockUser.id);
      res.body.data.replies.length.should.equal(1);
      res.body.data.star.should.equal(false);
      res.body.data.collect.should.equal(false);
    } catch(err) {
      should.ifError(err.message);
    }
  });
});
