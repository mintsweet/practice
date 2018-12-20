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
    mockUser = await support.createUser('123456@qq.com', '话题创建者');
    mockUser2 = await support.createUser('123457@qq.com', '回复者');
    mockTopic = await support.createTopic(mockUser.id);
    await support.createReply(mockUser2.id, mockTopic.id);
  });

  after(async function() {
    await support.deleteReply(mockTopic.id);
    await support.deleteTopic({ author_id: mockUser.id });
    await support.deleteUser(mockUser.email);
    await support.deleteUser(mockUser2.email);
  });

  it('should / status 404 when the topic does not exist', async function() {
    try {
      const res = await request
        .get(`/v1/topic/${tempId}`)
        .expect(404);

      res.text.should.equal('话题不存在');
    } catch(err) {
      should.ifError(err.message);
    }
  });

  it('should / status 200 when the not signin', async function() {
    try {
      const res = await request
        .get(`/v1/topic/${mockTopic.id}`)
        .expect(200);

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
      let res = await request
        .post('/v1/signin')
        .send({
          email: mockUser2.email,
          password: 'a123456'
        })
        .expect(200);

      res = await request
        .get(`/v1/topic/${mockTopic.id}`)
        .set('Authorization', res.text)
        .expect(200);

      res.body.author.id.should.equal(mockUser.id);
      res.body.replies.length.should.equal(1);
      res.body.like.should.equal(false);
      res.body.collect.should.equal(false);
    } catch(err) {
      should.ifError(err.message);
    }
  });
});
