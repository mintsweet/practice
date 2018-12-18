const app = require('../../../app').listen();
const request = require('supertest')(app);
const should = require('should');
const support = require('../../support');
const tempId = require('mongoose').Types.ObjectId();

describe('test /v1/reply/:rid/up_or_down', function() {
  let mockUser;
  let mockUser2;
  let mockTopic;
  let mockReply;

  before(async function() {
    mockUser = await support.createUser('123456@qq.com', '话题创建者');
    mockUser2 = await support.createUser('123457@qq.com', '回复者');
    mockTopic = await support.createTopic(mockUser.id);
    mockReply = await support.createReply(mockUser2.id, mockTopic.id);
  });

  after(async function() {
    await support.deleteNotice(mockUser2.id);
    await support.deleteReply(mockTopic.id);
    await support.deleteTopic({ author_id: mockUser.id });
    await support.deleteUser(mockUser.email);
    await support.deleteUser(mockUser2.email);
  });

  it('should / status 401 when the not signin', async function() {
    try {
      const res = await request
        .patch(`/v1/reply/${mockReply.id}/up_or_down`)
        .expect(401);

      res.text.should.equal('尚未登录');
    } catch(err) {
      should.ifError(err.message);
    }
  });

  it('should / status 404 when the reply does not exist', async function() {
    try {
      let res = await request
        .post('/v1/signin')
        .send({
          email: mockUser.email,
          password: 'a123456'
        })
        .expect(200);

      res = await request
        .patch(`/v1/reply/${tempId}/up_or_down`)
        .set('Authorization', res.text)
        .expect(404);

      res.text.should.equal('回复不存在');
    } catch(err) {
      should.ifError(err.message);
    }
  });

  it('should / status 403 when the reply is yours', async function() {
    try {
      let res = await request
        .post('/v1/signin')
        .send({
          email: mockUser2.email,
          password: 'a123456'
        })
        .expect(200);

      res = await request
        .patch(`/v1/reply/${mockReply.id}/up_or_down`)
        .set('Authorization', res.text)
        .expect(403);

      res.text.should.equal('不能给自己点赞哟');
    } catch(err) {
      should.ifError(err.message);
    }
  });

  it('should / status 200 when the action up_or_down', async function() {
    try {
      let res = await request
        .post('/v1/signin')
        .send({
          email: mockUser.email,
          password: 'a123456'
        })
        .expect(200);

      res = await request
        .patch(`/v1/reply/${mockReply.id}/up_or_down`)
        .set('Authorization', res.text)
        .expect(200);

      res.text.should.equal('up');
    } catch(err) {
      should.ifError(err.message);
    }
  });

  // 正确 - 取消点赞
  it('should / status 200 when the action down', async function() {
    try {
      let res = await request
        .post('/v1/signin')
        .send({
          email: mockUser.email,
          password: 'a123456'
        })
        .expect(200);

      res = await request
        .patch(`/v1/reply/${mockReply.id}/up_or_down`)
        .set('Authorization', res.text)
        .expect(200);

      res.text.should.equal('down');
    } catch(err) {
      should.ifError(err.message);
    }
  });
});
