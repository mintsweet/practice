const app = require('../../app');
const request = require('supertest').agent(app);
const should = require('should');
const support = require('../support');
const tempId = require('mongoose').Types.ObjectId();

describe('test /v1/topic/:uid/edit', function() {
  let mockUser;
  let mockUser2;
  let mockTopic;

  before(async function() {
    mockUser = await support.createUser(18800000000, '话题创建者');
    mockUser2 = await support.createUser(18800000001, '话题无关者');
    mockTopic = await support.createTopic(mockUser.id);
  });

  after(async function() {
    await support.deleteTopic(mockUser.id);
    await support.deleteUser(mockUser.mobile);
    await support.deleteUser(mockUser2.mobile);
    mockUser = null;
    mockTopic = null;
    mockUser2 = null;
  });

  // 错误 - 尚未登录
  it('should / status 0 when the not signin', async function() {
    try {
      const res = await request.put(`/v1/topic/${mockTopic.id}/edit`).send({
        tab: 'share',
        title: '改名为分享类',
        content: '# 随便改点内容'
      });

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

      res = await request.put(`/v1/topic/${tempId}/edit`).send({
        tab: 'share',
        title: '改名为分享类',
        content: '# 随便改点内容'
      });

      res.body.status.should.equal(0);
      res.body.message.should.equal('话题不存在');
    } catch(err) {
      should.ifError(err.message);
    }
  });

  // 错误 - 不能编辑别人的话题
  it('should / status 0 when the topic not yours', async function() {
    try {
      let res;

      res = await request.post('/v1/signin').send({
        mobile: mockUser2.mobile,
        password: 'a123456'
      });

      res.body.status.should.equal(1);

      res = await request.put(`/v1/topic/${mockTopic.id}/edit`).send({
        tab: 'share',
        title: '改名为分享类',
        content: '# 随便改点内容'
      });

      res.body.status.should.equal(0);
      res.body.message.should.equal('不能编辑别人的话题');
    } catch(err) {
      should.ifError(err.message);
    }
  });

  // 正确
  it('should / status 1', async function() {
    try {
      let res;

      res = await request.post('/v1/signin').send({
        mobile: mockUser.mobile,
        password: 'a123456'
      });

      res.body.status.should.equal(1);

      res = await request.put(`/v1/topic/${mockTopic.id}/edit`).send({
        tab: 'share',
        title: '改名为分享类',
        content: '# 随便改点内容'
      });

      res.body.status.should.equal(1);
    } catch(err) {
      should.ifError(err.message);
    }
  });
});
