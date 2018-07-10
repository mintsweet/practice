const app = require('../../app');
const request = require('supertest').agent(app);
const should = require('should');
const support = require('../support');
const tempId = require('mongoose').Types.ObjectId();

describe('test /api/topic/:tid/collect_or_un', function() {
  let mockUser;
  let mockUser2;
  let mockTopic;

  before(async function() {
    mockUser = await support.createUser('话题收藏者', '18800000000');
    mockUser2 = await support.createUser('话题创建者', '18800000001');
    mockTopic = await support.createTopic(mockUser2.id);
  });

  after(async function() {
    await support.deleteUser(mockUser.mobile);
    await support.deleteUser(mockUser2.mobile);
    await support.deleteTopic(mockUser2.id);
    await support.deleteBehavior(mockUser.id);
    await support.deleteNotice(mockUser2.id);
    mockUser = null;
    mockUser2 = null;
    mockTopic = null;
  });

  // 错误 - 尚未登录
  it('should / status 0 when the not signin in yet', async function() {
    try {
      const res = await request.patch(`/api/topic/${mockTopic.id}/collect_or_un`);

      res.body.status.should.equal(0);
      res.body.type.should.equal('ERROR_NOT_SIGNIN');
      res.body.message.should.equal('尚未登录');
    } catch(err) {
      should.ifError(err.message);
    }
  });

  // 错误 - 无效的ID
  it('should / status 0 when the tid is invalid', async function() {
    try {
      let res;

      res = await request.post('/api/signin').send({
        mobile: mockUser.mobile,
        password: 'a123456'
      });

      res.body.status.should.equal(1);
      res.body.data.should.have.property('id');
      res.body.data.id.should.equal(mockUser.id);

      res = await request.patch(`/api/topic/${tempId}/collect_or_un`);

      res.body.status.should.equal(0);
      res.body.type.should.equal('ERROR_ID_IS_INVALID');
      res.body.message.should.equal('无效的ID');
    } catch(err) {
      should.ifError(err.message);
    }
  });

  // 错误 - 不能收藏自己的话题哟
  it('should / status 0 when the topic is yours', async function() {
    try {
      let res;

      res = await request.post('/api/signin').send({
        mobile: mockUser2.mobile,
        password: 'a123456'
      });

      res.body.status.should.equal(1);
      res.body.data.should.have.property('id');
      res.body.data.id.should.equal(mockUser2.id);

      res = await request.patch(`/api/topic/${mockTopic.id}/collect_or_un`);

      res.body.status.should.equal(0);
      res.body.type.should.equal('ERROR_NOT_COLLECT_YOURS');
      res.body.message.should.equal('不能收藏自己的话题哟');
    } catch(err) {
      should.ifError(err.message);
    }
  });

  // 正确 - 收藏
  it('should / status 1 | action collect', async function() {
    try {
      let res;

      res = await request.post('/api/signin').send({
        mobile: mockUser.mobile,
        password: 'a123456'
      });

      res.body.status.should.equal(1);
      res.body.data.should.have.property('id');
      res.body.data.id.should.equal(mockUser.id);

      res = await request.patch(`/api/topic/${mockTopic.id}/collect_or_un`);

      res.body.status.should.equal(1);
      res.body.action.should.equal('collect');
    } catch(err) {
      should.ifError(err.message);
    }
  });

  // 正确 - 取消收藏
  it('should / status 1 | action un_collect', async function() {
    try {
      let res;

      res = await request.post('/api/signin').send({
        mobile: mockUser.mobile,
        password: 'a123456'
      });

      res.body.status.should.equal(1);
      res.body.data.should.have.property('id');
      res.body.data.id.should.equal(mockUser.id);

      res = await request.patch(`/api/topic/${mockTopic.id}/collect_or_un`);

      res.body.status.should.equal(1);
      res.body.action.should.equal('un_collect');
    } catch(err) {
      should.ifError(err.message);
    }
  });
});
