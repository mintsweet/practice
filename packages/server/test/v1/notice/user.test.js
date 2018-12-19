const app = require('../../../app').listen();
const request = require('supertest')(app);
const should = require('should');
const support = require('../../support');

describe('test /v1/notice/user', function() {
  let mockUser;
  let mockUser2;
  let mockTopic;
  let mockReply;

  before(async function() {
    mockUser = await support.createUser('123456@qq.com', '消息发起者');
    mockUser2 = await support.createUser('123457@qq.com', '消息接收者');
    mockTopic = await support.createTopic(mockUser2.id);
    mockReply = await support.createReply(mockUser2, mockTopic.id);
    await support.createNotice('like', mockUser2.id, { author_id: mockUser.id, topic_id: mockTopic.id });
    await support.createNotice('collect', mockUser2.id, { author_id: mockUser.id, topic_id: mockTopic.id });
    await support.createNotice('follow', mockUser2.id, { author_id: mockUser.id });
    await support.createNotice('reply', mockUser2.id, { author_id: mockUser.id, topic_id: mockTopic.id });
    await support.createNotice('at', mockUser2.id, { author_id: mockUser.id, topic_id: mockTopic.id, reply_id: mockReply.id });
    await support.createNotice('up', mockUser2.id, { author_id: mockUser.id, topic_id: mockTopic.id, reply_id: mockReply.id });
  });

  after(async function() {
    await support.deleteNotice(mockUser2.id);
    await support.deleteReply(mockTopic.id);
    await support.deleteTopic({ author_id: mockUser2.id });
    await support.deleteUser(mockUser.email);
    await support.deleteUser(mockUser2.email);
  });

  it('should / status 400 when the not signin', async function() {
    try {
      const res = await request
        .get('/v1/notice/user')
        .expect(401);

      res.text.should.equal('尚未登录');
    } catch(err) {
      should.ifError(err.message);
    }
  });

  it('should / status 200', async function() {
    try {
      let res = await request
        .post('/v1/signin')
        .send({
          email: mockUser2.email,
          password: 'a123456'
        })
        .expect(200);

      res = await request
        .get('/v1/notice/user')
        .set('Authorization', res.text)
        .expect(200);

      res.body.should.be.an.Array();
      res.body.length.should.equal(6);
    } catch(err) {
      should.ifError(err.message);
    }
  });
});
