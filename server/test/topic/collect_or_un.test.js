const app = require('../../app');
const request = require('supertest').agent(app);
const should = require('should');
const support = require('../support');
const tempId = require('mongoose').Types.ObjectId();

describe('test /v1/topic/:tid/collect_or_un', function() {
  let mockUser;
  let mockUser2;
  let mockTopic;

  before(async function() {
    mockUser = await support.createUser(18800000000, '话题创建者');
    mockUser2 = await support.createUser(18800000001, '点赞者');
    mockTopic = await support.createTopic(mockUser.id);
  });

  after(async function() {
    await support.deleteNotice(mockUser.id);
    await support.deleteAction(mockUser2.id);
    await support.deleteTopic(mockUser.id);
    await support.deleteUser(mockUser.mobile);
    await support.deleteUser(mockUser2.mobile);
    mockUser = null;
    mockUser2 = null;
    mockTopic = null;
  });

  // 错误 - 尚未登录
  it('should / status 0 when the not signin', async function() {
    try {
      const res = await request.patch(`/v1/topic/${mockTopic.id}/collect_or_un`);

      res.body.status.should.equal(0);
      res.body.message.should.equal('尚未登录');
    } catch(err) {
      should.ifError(err.message);
    }
  });

  // 错误 - 话题不存在
  it('should / status 0 when the topic does not exist', async function() {
    try {
      let res;

      res = await request.post('/v1/signin').send({
        mobile: mockUser.mobile,
        password: 'a123456'
      });

      res.body.status.should.equal(1);

      res = await request.patch(`/v1/topic/${tempId}/collect_or_un`);

      res.body.status.should.equal(0);
      res.body.message.should.equal('话题不存在');
    } catch(err) {
      should.ifError(err.message);
    }
  });

  // 错误 - 不能收藏自己的话题哟
  it('should / status 0 when the topic is yours', async function() {
    try {
      let res;

      res = await request.post('/v1/signin').send({
        mobile: mockUser.mobile,
        password: 'a123456'
      });

      res.body.status.should.equal(1);

      res = await request.patch(`/v1/topic/${mockTopic.id}/collect_or_un`);

      res.body.status.should.equal(0);
      res.body.message.should.equal('不能收藏自己的话题哟');
    } catch(err) {
      should.ifError(err.message);
    }
  });

  // 正确 - 收藏
  it('should / status 1', async function() {
    try {
      let res;

      res = await request.post('/v1/signin').send({
        mobile: mockUser2.mobile,
        password: 'a123456'
      });

      res.body.status.should.equal(1);

      res = await request.patch(`/v1/topic/${mockTopic.id}/collect_or_un`);

      res.body.status.should.equal(1);
      res.body.data.should.equal('collect');
    } catch(err) {
      should.ifError(err.message);
    }
  });

  // 正确 - 取消收藏
  it('should / status 1', async function() {
    try {
      let res;

      res = await request.post('/v1/signin').send({
        mobile: mockUser2.mobile,
        password: 'a123456'
      });

      res.body.status.should.equal(1);

      res = await request.patch(`/v1/topic/${mockTopic.id}/collect_or_un`);

      res.body.status.should.equal(1);
      res.body.data.should.equal('un_collect');
    } catch(err) {
      should.ifError(err.message);
    }
  });
});
