const app = require('../../../app').listen();
const request = require('supertest')(app);
const should = require('should');
const support = require('../../support');
const tempId = require('mongoose').Types.ObjectId();

describe('test /v1/topic/:tid/reply', function() {
  let mockUser;
  let mockUser2;
  let mockTopic;
  let mockReply;

  before(async function() {
    mockUser = await support.createUser('123456@qq.com', '话题创建者');
    mockUser2 = await support.createUser('123457@qq.com', '回复者');
    mockTopic = await support.createTopic(mockUser.id);
    mockReply = await support.createReply(mockUser.id, mockTopic.id);
  });

  after(async function() {
    await support.deleteNotice(mockUser.id);
    await support.deleteReply(mockTopic.id);
    await support.deleteTopic({ author_id: mockUser.id });
    await support.deleteUser(mockUser.email);
    await support.deleteUser(mockUser2.email);
  });

  it('should / status 401 when the not signin', async function() {
    try {
      const res = await request
        .post(`/v1/topic/${mockTopic.id}/reply`)
        .send({
          content: '# 这是一段测试回复内容'
        })
        .expect(401);

      res.text.should.equal('尚未登录');
    } catch(err) {
      should.ifError(err.message);
    }
  });

  it('should / status 404 when the not find topic', async function() {
    try {
      let res = await request
        .post('/signin')
        .send({
          email: mockUser2.email,
          password: 'a123456'
        })
        .expect(200);

      res = await request
        .post(`/v1/topic/${tempId}/reply`)
        .send({
          content: '# 这是一段测试回复内容'
        })
        .set('Authorization', res.text)
        .expect(404);

      res.text.should.equal('话题不存在');
    } catch(err) {
      should.ifError(err.message);
    }
  });

  it('should / status 400 when the content is invalid', async function() {
    try {
      let res = await request
        .post('/signin')
        .send({
          email: mockUser2.email,
          password: 'a123456'
        })
        .expect(200);

      res = await request
        .post(`/v1/topic/${mockTopic.id}/reply`)
        .send({
          content: ''
        })
        .set('Authorization', res.text)
        .expect(400);

      res.text.should.equal('回复内容不能为空');
    } catch(err) {
      should.ifError(err.message);
    }
  });

  it('should / status 200 when the reply topic', async function() {
    try {
      const res = await request
        .post('/signin')
        .send({
          email: mockUser2.email,
          password: 'a123456'
        }).expect(200);

      await request
        .post(`/v1/topic/${mockTopic.id}/reply`)
        .send({
          content: '# 这是一段测试回复内容'
        })
        .set('Authorization', res.text)
        .expect(200);
    } catch(err) {
      should.ifError(err.message);
    }
  });

  it('should / status 200 when the reply a reply', async function() {
    try {
      const res = await request
        .post('/signin')
        .send({
          email: mockUser2.email,
          password: 'a123456'
        })
        .expect(200);

      await request
        .post(`/v1/topic/${mockTopic.id}/reply`)
        .send({
          reply_id: mockReply.id,
          content: '# 这是一段回复中的回复'
        })
        .set('Authorization', res.text)
        .expect(200);
    } catch(err) {
      should.ifError(err.message);
    }
  });
});
