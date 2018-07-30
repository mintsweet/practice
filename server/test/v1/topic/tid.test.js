const app = require('../../../app').listen();
const request = require('supertest')(app);
const should = require('should');
const support = require('../../support');
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

  it('should / status 410 when the topic does not exist', async function() {
    try {
      const res = await request.get(`/v1/topic/${tempId}`);

      res.status.should.equal(410);
      res.error.text.should.equal('话题不存在');
    } catch(err) {
      should.ifError(err.message);
    }
  });

  it('should / status 200 when the not signin', async function() {
    try {
      const res = await request.get(`/v1/topic/${mockTopic.id}`);

      res.status.should.equal(200);
      res.body.author.id.should.equal(mockUser.id);
      res.body.replies.length.should.equal(1);
      res.body.like.should.equal(false);
      res.body.collect.should.equal(false);
    } catch(err) {
      should.ifError(err.message);
    }
  });

  it('should / status 200 when the signin', async function() {
    try {
      let res;

      res = await request.post('/v1/signin').send({
        mobile: mockUser2.mobile,
        password: 'a123456'
      });

      res.status.should.equal(200);

      res = await request.get(`/v1/topic/${mockTopic.id}`).set('Authorization', res.text);

      res.status.should.equal(200);
      res.body.author.id.should.equal(mockUser.id);
      res.body.replies.length.should.equal(1);
      res.body.like.should.equal(false);
      res.body.collect.should.equal(false);
    } catch(err) {
      should.ifError(err.message);
    }
  });
});
