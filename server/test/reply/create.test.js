const app = require('../../app');
const request = require('supertest').agent(app);
const should = require('should');
const support = require('../support');
const tempId = require('mongoose').Types.ObjectId();

describe('test /api/topic/:tid/reply', function() {
  let mockUser;
  let mockUser2;
  let mockTopic;

  before(async function() {
    mockUser = await support.createUser('帖子创建者', '18800000000');
    mockUser2 = await support.createUser('回复、行为、消息发起者', '18800000001');
    mockTopic = await support.createTopic(mockUser.id);
  });

  after(async function() {
    await support.deleteReply(mockTopic.id);
    await support.deleteTopic(mockUser.id);
    await support.deleteBehavior(mockUser2.id);
    await support.deleteNotice(mockUser2.id);
    await support.deleteUser(mockUser.mobile);
    await support.deleteUser(mockUser2.mobile);
    mockUser = null;
    mockUser2 = null;
    mockTopic = null;
  });

  // 错误 - 尚未登录
  it('should return status 0 when the not signin', async function() {
    try {
      const res = await request.post(`/api/topic/${mockTopic.id}/reply`).send({
        content: '# 这是一段测试回复内容'
      });
      res.body.status.should.equal(0);
      res.body.type.should.equal('ERROR_NOT_SIGNIN');
      res.body.message.should.equal('尚未登录');
    } catch(err) {
      should.ifError(err.message);
    }
  });

  // 错误 - 未找到话题
  it('should return status 0 when the not find topic', async function() {
    try {
      let res;

      res = await request.post('/api/signin').send({
        mobile: mockUser2.mobile,
        password: 'a123456'
      });
      res.body.status.should.equal(1);
      res.body.data.should.have.property('id');
      res.body.data.id.should.equal(mockUser2.id);

      res = await request.post(`/api/topic/${tempId}/reply`).send({
        content: '# 这是一段测试回复内容'
      });
      res.body.status.should.equal(0);
      res.body.type.should.equal('ERROR_NO_TOPIC');
      res.body.message.should.equal('未找到话题');
    } catch(err) {
      should.ifError(err.message);
    }
  });

  // 错误 - 回复内容不能为空
  it('should return status 0 when the not find topic', async function() {
    try {
      let res;

      res = await request.post('/api/signin').send({
        mobile: mockUser2.mobile,
        password: 'a123456'
      });
      res.body.status.should.equal(1);
      res.body.data.should.have.property('id');
      res.body.data.id.should.equal(mockUser2.id);

      res = await request.post(`/api/topic/${tempId}/reply`).send({
        content: ''
      });
      res.body.status.should.equal(0);
      res.body.type.should.equal('ERROR_NO_TOPIC');
      res.body.message.should.equal('未找到话题');
    } catch(err) {
      should.ifError(err.message);
    }
  });

  // 正确
  it('should return status 1', async function() {
    try {
      let res;

      res = await request.post('/api/signin').send({
        mobile: mockUser2.mobile,
        password: 'a123456'
      });
      res.body.status.should.equal(1);
      res.body.data.should.have.property('id');
      res.body.data.id.should.equal(mockUser2.id);

      res = await request.post(`/api/topic/${mockTopic.id}/reply`).send({
        content: '# 这是一段测试回复内容'
      });
      res.body.status.should.equal(1);
    } catch(err) {
      should.ifError(err.message);
    }
  });
});
