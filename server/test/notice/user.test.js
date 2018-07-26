const app = require('../../app');
const request = require('supertest').agent(app);
const should = require('should');
const support = require('../support');

describe('test /api/notice/user', function() {
  let mockUser;
  let mockUser2;
  let mockTopic;

  before(async function() {
    mockUser = await support.createUser('消息发起者', '18800000000');
    mockUser2 = await support.createUser('消息接收者', '18800000001');
    mockTopic = await support.createTopic(mockUser2.id);
    await support.createNotice('star', mockUser2.id, { author_id: mockUser.id, topic_id: mockTopic.id });
    await support.createNotice('collect', mockUser2.id, { author_id: mockUser.id, topic_id: mockTopic.id });
    await support.createNotice('follow', mockUser2.id, { author_id: mockUser.id });
  });

  after(async function() {
    await support.deleteNotice(mockUser2.id);
    await support.deleteTopic(mockUser2.id);
    await support.deleteUser(mockUser.mobile);
    await support.deleteUser(mockUser2.mobile);
  });

  it('should / status 0 when the not signin', async function() {
    try {
      const res = await request.get('/api/notice/user');
      res.body.status.should.equal(0);
      res.body.type.should.equal('ERROR_NOT_SIGNIN');
      res.body.message.should.equal('尚未登录');
    } catch(err) {
      should.ifError(err.message);
    }
  });

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

      res = await request.get('/api/notice/user');

      res.body.status.should.equal(1);
      res.body.data.length.should.equal(3);
    } catch(err) {
      should.ifError(err.message);
    }
  });
});
