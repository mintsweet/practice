const app = require('../../app');
const request = require('supertest').agent(app);
const should = require('should');
const support = require('../support');
const tempId = require('mongoose').Types.ObjectId();

describe('test /v1/topic/:tid/reply', function() {
  let mockUser;
  let mockUser2;
  let mockTopic;
  let mockReply;

  before(async function() {
    mockUser = await support.createUser(18800000000, '话题创建者');
    mockUser2 = await support.createUser(18800000001, '回复者');
    mockTopic = await support.createTopic(mockUser.id);
    mockReply = await support.createReply(mockUser.id, mockTopic.id);
  });

  after(async function() {
    await support.deleteNotice(mockUser.id);
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
      const res = await request.post(`/v1/topic/${mockTopic.id}/reply`).send({
        content: '# 这是一段测试回复内容'
      });

      res.body.status.should.equal(0);
      res.body.message.should.equal('尚未登录');
    } catch(err) {
      should.ifError(err.message);
    }
  });

  // 错误 - 未找到话题
  it('should / status 0 when the not find topic', async function() {
    try {
      let res;

      res = await request.post('/v1/signin').send({
        mobile: mockUser2.mobile,
        password: 'a123456'
      });

      res.body.status.should.equal(1);

      res = await request.post(`/v1/topic/${tempId}/reply`).send({
        content: '# 这是一段测试回复内容'
      });

      res.body.status.should.equal(0);
      res.body.message.should.equal('话题不存在');
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

      res = await request.post(`/v1/topic/${mockTopic.id}/reply`).send({
        content: ''
      });

      res.body.status.should.equal(0);
      res.body.message.should.equal('回复内容不能为空');
    } catch(err) {
      should.ifError(err.message);
    }
  });

  // 正确 - 回复话题
  it('should / status 1 when the reply topic', async function() {
    try {
      let res;

      res = await request.post('/v1/signin').send({
        mobile: mockUser2.mobile,
        password: 'a123456'
      });

      res.body.status.should.equal(1);

      res = await request.post(`/v1/topic/${mockTopic.id}/reply`).send({
        content: '# 这是一段测试回复内容'
      });

      res.body.status.should.equal(1);
    } catch(err) {
      should.ifError(err.message);
    }
  });

  // 正确 - 回复回复
  it('should / status 1 when the reply reply', async function() {
    try {
      let res;

      res = await request.post('/v1/signin').send({
        mobile: mockUser2.mobile,
        password: 'a123456'
      });

      res.body.status.should.equal(1);

      res = await request.post(`/v1/topic/${mockTopic.id}/reply`).send({
        reply_id: mockReply.id,
        content: '# 这是一段回复中的回复'
      });

      res.body.status.should.equal(1);
    } catch(err) {
      should.ifError(err.message);
    }
  });
});
