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
    mockUser = await support.createUser(18800000000, '话题创建者');
    mockUser2 = await support.createUser(18800000001, '回复者');
    mockTopic = await support.createTopic(mockUser.id);
    await support.createReply(mockUser2.id, mockTopic.id);
  });

  after(async function() {
    await support.deleteReply(mockTopic.id);
    await support.deleteTopic(mockUser.id);
    await support.deleteUser(mockUser.mobile);
    await support.deleteUser(mockUser2.mobile);
    mockUser = null;
    mockUser2 = null;
    mockTopic = null;
  });

  // 错误 - 话题不存在
  it('should / status 0 when the topic does not exist', async function() {
    try {
      const res = await request.get(`/v1/topic/${tempId}`);

      res.body.status.should.equal(0);
      res.body.message.should.equal('话题不存在');
    } catch(err) {
      should.ifError(err.message);
    }
  });

  // 正确 - 未登录
  it('should / status 1', async function() {
    try {
      const res = await request.get(`/v1/topic/${mockTopic.id}`);

      res.body.status.should.equal(1);
      res.body.data.author.id.should.equal(mockUser.id);
      res.body.data.replies.length.should.equal(1);
      res.body.data.like.should.equal(false);
      res.body.data.collect.should.equal(false);
    } catch(err) {
      should.ifError(err.message);
    }
  });

  // 正确 - 登录后
  it('should / status 1', async function() {
    try {
      let res;

      res = await request.post('/v1/signin').send({
        mobile: mockUser2.mobile,
        password: 'a123456'
      });

      res.body.status.should.equal(1);

      res = await request.get(`/v1/topic/${mockTopic.id}`);

      res.body.status.should.equal(1);
      res.body.data.author.id.should.equal(mockUser.id);
      res.body.data.replies.length.should.equal(1);
      res.body.data.like.should.equal(false);
      res.body.data.collect.should.equal(false);
    } catch(err) {
      should.ifError(err.message);
    }
  });
});
