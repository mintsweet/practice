const app = require('../../app');
const request = require('supertest').agent(app);
const should = require('should');
const support = require('../support');
const tempId = require('mongoose').Types.ObjectId();

describe('test /api/reply/:rid/delete', function() {
  let mockUser;
  let mockUser2;
  let mockTopic;
  let mockReply;

  before(async function() {
    mockUser = await support.createUser('回复发起者', '18800000000');
    mockUser2 = await support.createUser('回复无关者', '18800000001');
    mockTopic = await support.createTopic(mockUser.id);
    mockReply = await support.createReply(mockUser.id, mockTopic.id);
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
  it('should return status 0 when the not signin', async function() {
    try {
      const res = await request.delete(`/api/reply/${mockReply.id}/delete`);
      res.body.status.should.equal(0);
      res.body.type.should.equal('ERROR_NOT_SIGNIN');
      res.body.message.should.equal('尚未登录');
    } catch(err) {
      should.ifError(err.message);
    }
  });

  // 错误 - 无效的ID
  it('should return status 0 when the id is invalid', async function() {
    try {
      let res;

      res = await request.post('/api/signin').send({
        mobile: mockUser.mobile,
        password: 'a123456'
      });
      res.body.status.should.equal(1);
      res.body.data.should.have.property('id');
      res.body.data.id.should.equal(mockUser.id);

      res = await request.delete(`/api/reply/${tempId}/delete`);
      res.body.status.should.equal(0);
      res.body.type.should.equal('ERROR_ID_IS_INVALID');
      res.body.message.should.equal('无效的ID');
    } catch(err) {
      should.ifError(err.message);
    }
  });

  // 错误 - 不能删除别人的回复
  it('should return status 0 when the not signin', async function() {
    try {
      let res;

      res = await request.post('/api/signin').send({
        mobile: mockUser2.mobile,
        password: 'a123456'
      });
      res.body.status.should.equal(1);
      res.body.data.should.have.property('id');
      res.body.data.id.should.equal(mockUser2.id);

      res = await request.delete(`/api/reply/${mockReply.id}/delete`);
      res.body.status.should.equal(0);
      res.body.type.should.equal('ERROR_IS_NOT_AUTHOR');
      res.body.message.should.equal('不能删除别人的回复');
    } catch(err) {
      should.ifError(err.message);
    }
  });

  // 正确
  it('should return status 1', async function() {
    try {
      let res;

      res = await request.post('/api/signin').send({
        mobile: mockUser.mobile,
        password: 'a123456'
      });
      res.body.status.should.equal(1);
      res.body.data.should.have.property('id');
      res.body.data.id.should.equal(mockUser.id);

      res = await request.delete(`/api/reply/${mockReply.id}/delete`);
      res.body.status.should.equal(1);
    } catch(err) {
      should.ifError(err.message);
    }
  });
});
