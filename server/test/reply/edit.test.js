const app = require('../../app');
const request = require('supertest').agent(app);
const should = require('should');
const support = require('../support');
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
    mockUser = null;
    mockUser2 = null;
    mockTopic = null;
    mockReply = null;
  });

  // 错误 - 尚未登录
  it('should / status 0 when the not signin', async function() {
    try {
      const res = await request.put(`/v1/reply/${mockReply.id}/edit`).send({
        content: '# 这是一段回复修改内容'
      });

      res.body.status.should.equal(0);
      res.body.message.should.equal('尚未登录');
    } catch(err) {
      should.ifError(err.message);
    }
  });

  // 错误 - 回复不存在
  it('should / status 0 when the reply does not exist', async function() {
    try {
      let res;

      res = await request.post('/v1/signin').send({
        mobile: mockUser.mobile,
        password: 'a123456'
      });

      res.body.status.should.equal(1);

      res = await request.put(`/v1/reply/${tempId}/edit`).send({
        content: '# 这是一段回复修改内容'
      });

      res.body.status.should.equal(0);
      res.body.message.should.equal('回复不存在');
    } catch(err) {
      should.ifError(err.message);
    }
  });

  // 错误 - 不能编辑别人的评论
  it('should / status 0 when the reply not yours', async function() {
    try {
      let res;

      res = await request.post('/v1/signin').send({
        mobile: mockUser.mobile,
        password: 'a123456'
      });

      res.body.status.should.equal(1);

      res = await request.put(`/v1/reply/${mockReply.id}/edit`).send({
        content: '# 这是一段回复修改内容'
      });

      res.body.status.should.equal(0);
      res.body.message.should.equal('不能编辑别人的评论');
    } catch(err) {
      should.ifError(err.message);
    }
  });

  // 错误 - 回复内容不能为空
  it('should / status 0 when the content is invalid', async function() {
    try {
      let res;

      res = await request.post('/v1/signin').send({
        mobile: mockUser2.mobile,
        password: 'a123456'
      });

      res.body.status.should.equal(1);

      res = await request.put(`/v1/reply/${mockReply.id}/edit`).send({
        content: ''
      });

      res.body.status.should.equal(0);
      res.body.message.should.equal('回复内容不能为空');
    } catch(err) {
      should.ifError(err.message);
    }
  });

  // 正确
  it('should / status 1', async function() {
    try {
      let res;

      res = await request.post('/v1/signin').send({
        mobile: mockUser2.mobile,
        password: 'a123456'
      });

      res.body.status.should.equal(1);

      res = await request.put(`/v1/reply/${mockReply.id}/edit`).send({
        content: '# 这是一段回复修改内容'
      });

      res.body.status.should.equal(1);
    } catch(err) {
      should.ifError(err.message);
    }
  });
});
