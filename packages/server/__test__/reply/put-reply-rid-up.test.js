const { Types } = require('mongoose');
const app = require('../../app').listen();
const request = require('supertest')(app);
const should = require('should');
const support = require('../support');

describe('test /reply/:rid/up', function() {
  let mockUser;
  let mockUser2;
  let mockTopic;
  let mockReply;

  before(async function() {
    mockUser = await support.createUser('123456@qq.com');
    mockUser2 = await support.createUser('123457@qq.com');
    mockTopic = await support.createTopic(mockUser._id);
    mockReply = await support.createReply(mockUser2._id, mockTopic._id);
  });

  after(async function() {
    await support.deleteNotice(mockUser2._id);
    await support.deleteReply(mockTopic._id);
    await support.deleteTopic(mockUser._id);
    await support.deleteUser(mockUser.email);
    await support.deleteUser(mockUser2.email);
  });

  it('should / status 401 when the not signin', async function() {
    try {
      const res = await request.put(`/reply/${mockReply.id}/up`).expect(401);

      res.text.should.equal('尚未登录');
    } catch (err) {
      should.ifError(err.message);
    }
  });

  it('should / status 404 when the reply does not exist', async function() {
    try {
      let res = await request
        .post('/signin')
        .send({
          email: mockUser.email,
          password: 'a123456',
        })
        .expect(200);

      res = await request
        .put(`/reply/${Types.ObjectId()}/up`)
        .set('Authorization', res.text)
        .expect(404);

      res.text.should.equal('回复不存在');
    } catch (err) {
      should.ifError(err.message);
    }
  });

  it('should / status 403 when the reply is yours', async function() {
    try {
      let res = await request
        .post('/signin')
        .send({
          email: mockUser2.email,
          password: 'a123456',
        })
        .expect(200);

      res = await request
        .put(`/reply/${mockReply._id}/up`)
        .set('Authorization', res.text)
        .expect(403);

      res.text.should.equal('不能给自己点赞哟');
    } catch (err) {
      should.ifError(err.message);
    }
  });

  it('should / status 200', async function() {
    try {
      let res = await request
        .post('/signin')
        .send({
          email: mockUser.email,
          password: 'a123456',
        })
        .expect(200);

      res = await request
        .put(`/reply/${mockReply._id}/up`)
        .set('Authorization', res.text)
        .expect(200);

      res.text.should.equal('');
    } catch (err) {
      should.ifError(err.message);
    }
  });
});
