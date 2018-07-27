const app = require('../../app');
const request = require('supertest').agent(app);
const should = require('should');
const support = require('../support');
const tempId = require('mongoose').Types.ObjectId();

describe('test /v1/reply/:rid/up', function() {
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
    await support.deleteNotice(mockUser2.id);
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
      const res = await request.patch(`/v1/reply/${mockReply.id}/up`);

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

      res = await request.patch(`/v1/reply/${tempId}/up`);

      res.body.status.should.equal(0);
      res.body.message.should.equal('回复不存在');
    } catch(err) {
      should.ifError(err.message);
    }
  });

  // 错误 - 不能给自己点赞
  it('should / status 0 when the reply is yours', async function() {
    try {
      let res;

      res = await request.post('/v1/signin').send({
        mobile: mockUser2.mobile,
        password: 'a123456'
      });

      res.body.status.should.equal(1);

      res = await request.patch(`/v1/reply/${mockReply.id}/up`);

      res.body.status.should.equal(0);
      res.body.message.should.equal('不能给自己点赞哟');
    } catch(err) {
      should.ifError(err.message);
    }
  });

  // 正确 - 点赞
  it('should / status 1', async function() {
    try {
      let res;

      res = await request.post('/v1/signin').send({
        mobile: mockUser.mobile,
        password: 'a123456'
      });

      res.body.status.should.equal(1);

      res = await request.patch(`/v1/reply/${mockReply.id}/up`);

      res.body.status.should.equal(1);
      res.body.data.should.equal('up');
    } catch(err) {
      should.ifError(err.message);
    }
  });

  // 正确 - 取消点赞
  it('should / status 1', async function() {
    try {
      let res;

      res = await request.post('/v1/signin').send({
        mobile: mockUser.mobile,
        password: 'a123456'
      });

      res.body.status.should.equal(1);

      res = await request.patch(`/v1/reply/${mockReply.id}/up`);

      res.body.status.should.equal(1);
      res.body.data.should.equal('down');
    } catch(err) {
      should.ifError(err.message);
    }
  });
});
