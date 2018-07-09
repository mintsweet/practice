const app = require('../../app');
const request = require('supertest').agent(app);
const should = require('should');
const support = require('../support');
const tempId = require('mongoose').Types.ObjectId();

describe('test /api/topic/:uid/edit', function() {
  let mockUser;
  let mockUser2;
  let mockTopic;

  before(async function() {
    mockUser = await support.createUser('话题创建者', '18800000000');
    mockUser2 = await support.createUser('话题无关者', '18800000001');
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
  it('should / status 0 when the not signin in yet', async function() {
    try {
      const res = await request.put(`/api/topic/${mockTopic.id}/edit`).send({
        tab: 'share',
        title: '改名为分享类',
        content: '# 随便改点内容'
      });

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

      res = await request.put(`/api/topic/${tempId}/edit`).send({
        tab: 'share',
        title: '改名为分享类',
        content: '# 随便改点内容'
      });

      res.body.status.should.equal(0);
      res.body.type.should.equal('ERROR_ID_IS_INVALID');
      res.body.message.should.equal('无效的ID');
    } catch(err) {
      should.ifError(err.message);
    }
  });

  // 错误 - 不能编辑别人的话题
  it('should / status 0 when the topic is not belong to  yours', async function() {
    try {
      let res;

      res = await request.post('/api/signin').send({
        mobile: mockUser2.mobile,
        password: 'a123456'
      });

      res.body.status.should.equal(1);
      res.body.data.should.have.property('id');
      res.body.data.id.should.equal(mockUser2.id);

      res = await request.put(`/api/topic/${mockTopic.id}/edit`).send({
        tab: 'share',
        title: '改名为分享类',
        content: '# 随便改点内容'
      });

      res.body.status.should.equal(0);
      res.body.type.should.equal('ERROR_IS_NOT_AUTHOR');
      res.body.message.should.equal('不能编辑别人的话题');
    } catch(err) {
      should.ifError(err.message);
    }
  });

  // 正确
  it('should / status 1', async function() {
    try {
      let res;

      res = await request.post('/api/signin').send({
        mobile: mockUser.mobile,
        password: 'a123456'
      });

      res.body.status.should.equal(1);
      res.body.data.should.have.property('id');
      res.body.data.id.should.equal(mockUser.id);

      res = await request.put(`/api/topic/${mockTopic.id}/edit`).send({
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
