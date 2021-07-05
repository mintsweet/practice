const app = require('../../app').listen();
const request = require('supertest')(app);
const should = require('should');
const support = require('../support');

describe('test /notice/user', function() {
  let mockUser;
  let mockUser2;
  let mockTopic;

  before(async function() {
    mockUser = await support.createUser('123456@qq.com', {
      nickname: '消息发起者',
    });
    mockUser2 = await support.createUser('123457@qq.com', {
      nickname: '消息接收者',
    });

    mockTopic = await support.createTopic(mockUser2.id);

    await Promise.all([
      support.createNotice({
        type: 'like',
        uid: mockUser2.id,
        aid: mockUser.id,
        tid: mockTopic.id,
      }),
      support.createNotice({
        type: 'collect',
        uid: mockUser2.id,
        author_id: mockUser.id,
        topic_id: mockTopic.id,
      }),
    ]);
  });

  after(async function() {
    await support.deleteNotice(mockUser2._id);
    await support.deleteTopic(mockUser2._id);
    await support.deleteUser(mockUser.email);
    await support.deleteUser(mockUser2.email);
  });

  it('should / status 400 when the not signin', async function() {
    try {
      const res = await request.get('/notice/user').expect(401);

      res.text.should.equal('尚未登录');
    } catch (err) {
      should.ifError(err.message);
    }
  });

  it('should / status 200', async function() {
    try {
      let res = await request
        .post('/signin')
        .send({
          email: mockUser2.email,
          password: 'a123456',
        })
        .expect(200);

      res = await request
        .get('/notice/user')
        .set('Authorization', res.text)
        .expect(200);

      res.body.should.be.an.Array();
      res.body.length.should.equal(2);
    } catch (err) {
      should.ifError(err.message);
    }
  });
});
