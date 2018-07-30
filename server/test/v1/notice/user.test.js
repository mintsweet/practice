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
    mockUser = await support.createUser(18800000000, '消息发起者');
    mockUser2 = await support.createUser(18800000001, '消息接收者');
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
    await support.deleteTopic(mockUser2.id);
    await support.deleteUser(mockUser.mobile);
    await support.deleteUser(mockUser2.mobile);
    mockUser = null;
    mockUser2 = null;
    mockTopic = null;
    mockReply = null;
  });

  it('should / status 400 when the not signin', async function() {
    try {
      const res = await request.get('/v1/notice/user');

      res.status.should.equal(401);
      res.error.text.should.equal('需要用户登录权限');
    } catch(err) {
      should.ifError(err.message);
    }
  });

  it('should / status 200', async function() {
    try {
      let res;

      res = await request.post('/v1/signin').send({
        mobile: mockUser2.mobile,
        password: 'a123456'
      });

      res.status.should.equal(200);

      res = await request.get('/v1/notice/user').set('Authorization', res.text);

      res.status.should.equal(200);
      res.body.length.should.equal(6);
    } catch(err) {
      should.ifError(err.message);
    }
  });
});
