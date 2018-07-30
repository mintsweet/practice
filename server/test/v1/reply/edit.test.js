const app = require('../../../app').listen();
const request = require('supertest')(app);
const should = require('should');
const support = require('../../support');
const tempId = require('mongoose').Types.ObjectId();

describe('test /v1/reply/:rid/edit', function() {
  let mockUser;
  let mockUser2;
  let mockTopic;
  let mockReply;

  before(async function() {
    mockUser = await support.createUser(18800000000, '话题创建者');
    mockUser2 = await support.createUser(18800000001, '回复者');
    mockTopic = await support.createTopic(mockUser.id);
    mockReply = await support.createReply(mockUser2.id, mockTopic.id);
  });

  after(async function() {
    await support.deleteReply(mockTopic.id);
    await support.deleteTopic(mockUser.id);
    await support.deleteUser(mockUser.mobile);
    await support.deleteUser(mockUser2.mobile);
  });

  it('should / status 401 when the not signin', async function() {
    try {
      const res = await request.put(`/v1/reply/${mockReply.id}/edit`).send({
        content: '# 这是一段回复修改内容'
      }).expect(401);

      res.text.should.equal('需要用户权限');
    } catch(err) {
      should.ifError(err.message);
    }
  });

  it('should / status 410 when the reply does not exist', async function() {
    try {
      let res = await request.post('/v1/signin').send({
        mobile: mockUser.mobile,
        password: 'a123456'
      }).expect(200);

      res = await request.put(`/v1/reply/${tempId}/edit`).send({
        content: '# 这是一段回复修改内容'
      }).set('Authorization', res.text).expect(410);

      res.text.should.equal('回复不存在');
    } catch(err) {
      should.ifError(err.message);
    }
  });

  it('should / status 403 when the reply not yours', async function() {
    try {
      let res = await request.post('/v1/signin').send({
        mobile: mockUser.mobile,
        password: 'a123456'
      }).expect(200);

      res = await request.put(`/v1/reply/${mockReply.id}/edit`).send({
        content: '# 这是一段回复修改内容'
      }).set('Authorization', res.text).expect(403);

      res.text.should.equal('不能编辑别人的评论');
    } catch(err) {
      should.ifError(err.message);
    }
  });

  it('should / status 400 when the content is invalid', async function() {
    try {
      let res = await request.post('/v1/signin').send({
        mobile: mockUser2.mobile,
        password: 'a123456'
      }).expect(200);

      res = await request.put(`/v1/reply/${mockReply.id}/edit`).send({
        content: ''
      }).set('Authorization', res.text).expect(400);

      res.text.should.equal('回复内容不能为空');
    } catch(err) {
      should.ifError(err.message);
    }
  });

  it('should / status 200', async function() {
    try {
      const res = await request.post('/v1/signin').send({
        mobile: mockUser2.mobile,
        password: 'a123456'
      }).expect(200);

      await request.put(`/v1/reply/${mockReply.id}/edit`).send({
        content: '# 这是一段回复修改内容'
      }).set('Authorization', res.text).expect(200);
    } catch(err) {
      should.ifError(err.message);
    }
  });
});
