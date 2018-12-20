const app = require('../../../app').listen();
const request = require('supertest')(app);
const should = require('should');
const support = require('../../support');
const tempId = require('mongoose').Types.ObjectId();

describe('test /v1/topic/:tid/like_or_un', function() {
  let mockUser;
  let mockUser2;
  let mockTopic;

  before(async function() {
    mockUser = await support.createUser('123456@qq.com', '话题创建者');
    mockUser2 = await support.createUser('123457@qq.com', '点赞者');
    mockTopic = await support.createTopic(mockUser.id);
  });

  after(async function() {
    await support.deleteNotice(mockUser.id);
    await support.deleteAction(mockUser2.id);
    await support.deleteTopic({ author_id: mockUser.id });
    await support.deleteUser(mockUser.email);
    await support.deleteUser(mockUser2.email);
  });

  it('should / status 401 when the not signin', async function() {
    try {
      const res = await request
        .patch(`/v1/topic/${mockTopic.id}/like_or_un`)
        .expect(401);

      res.text.should.equal('尚未登录');
    } catch(err) {
      should.ifError(err.message);
    }
  });

  it('should / status 404 when the topic does not exist', async function() {
    try {
      let res = await request
        .post('/v1/signin')
        .send({
          email: mockUser.email,
          password: 'a123456'
        })
        .expect(200);

      res = await request
        .patch(`/v1/topic/${tempId}/like_or_un`)
        .set('Authorization', res.text)
        .expect(404);

      res.text.should.equal('话题不存在');
    } catch(err) {
      should.ifError(err.message);
    }
  });

  it('should / status 403 when the topic is yours', async function() {
    try {
      let res = await request
        .post('/v1/signin')
        .send({
          email: mockUser.email,
          password: 'a123456'
        })
        .expect(200);

      res = await request
        .patch(`/v1/topic/${mockTopic.id}/like_or_un`)
        .set('Authorization', res.text)
        .expect(403);

      res.text.should.equal('不能喜欢自己的话题哟');
    } catch(err) {
      should.ifError(err.message);
    }
  });

  it('should / status 200 when action is like', async function() {
    try {
      let res = await request
        .post('/v1/signin')
        .send({
          email: mockUser2.email,
          password: 'a123456'
        })
        .expect(200);

      res = await request
        .patch(`/v1/topic/${mockTopic.id}/like_or_un`)
        .set('Authorization', res.text)
        .expect(200);

      res.text.should.equal('like');
    } catch(err) {
      should.ifError(err.message);
    }
  });

  it('should / status 200 when the action is un_like', async function() {
    try {
      let res = await request
        .post('/v1/signin')
        .send({
          email: mockUser2.email,
          password: 'a123456'
        })
        .expect(200);

      res = await request
        .patch(`/v1/topic/${mockTopic.id}/like_or_un`)
        .set('Authorization', res.text)
        .expect(200);

      res.text.should.equal('un_like');
    } catch(err) {
      should.ifError(err.message);
    }
  });
});
