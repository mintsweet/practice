const app = require('../../app');
const request = require('supertest').agent(app);
const should = require('should');
const support = require('../support');

describe('test /v1/create', function() {
  let mockUser;

  before(async function() {
    mockUser = await support.createUser(18800000000, '话题创建者');
  });

  after(async function() {
    await support.deleteAction(mockUser.id);
    await support.deleteTopic(mockUser.id);
    await support.deleteUser(mockUser.mobile);
    mockUser = null;
  });

  // 错误 - 尚未登录
  it('should / status 0 when the not signin', async function() {
    try {
      const res = await request.post('/v1/create').send({
        tab: 'ask',
        title: '测试标题',
        content: '# 哈哈哈哈哈测试内容'
      });

      res.body.status.should.equal(0);
      res.body.message.should.equal('尚未登录');
    } catch(err) {
      should.ifError(err.message);
    }
  });

  // 错误 - 话题所属标签不能为空
  it('should / status 0 when the tab is invalid', async function() {
    try {
      let res;

      res = await request.post('/v1/signin').send({
        mobile: mockUser.mobile,
        password: 'a123456'
      });

      res.body.status.should.equal(1);

      res = await request.post('/v1/create').send({
        title: '测试标题',
        content: '# 哈哈哈哈哈测试内容'
      });

      res.body.status.should.equal(0);
      res.body.message.should.equal('话题所属标签不能为空');
    } catch(err) {
      should.ifError(err.message);
    }
  });

  // 错误 - 话题标题不能为空
  it('should / status 0 when the title is invalid', async function() {
    try {
      let res;

      res = await request.post('/v1/signin').send({
        mobile: mockUser.mobile,
        password: 'a123456'
      });

      res.body.status.should.equal(1);

      res = await request.post('/v1/create').send({
        tab: 'ask',
        content: '# 哈哈哈哈哈测试内容'
      });

      res.body.status.should.equal(0);
      res.body.message.should.equal('话题标题不能为空');
    } catch(err) {
      should.ifError(err.message);
    }
  });

  // 错误 - 话题内容不能为空
  it('should / status 0 when the content is invalid', async function() {
    try {
      let res;

      res = await request.post('/v1/signin').send({
        mobile: mockUser.mobile,
        password: 'a123456'
      });

      res.body.status.should.equal(1);

      res = await request.post('/v1/create').send({
        tab: 'ask',
        title: '测试标题'
      });

      res.body.status.should.equal(0);
      res.body.message.should.equal('话题内容不能为空');
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

      res = await request.post('/v1/create').send({
        tab: 'ask',
        title: '测试标题',
        content: '# 哈哈哈哈哈测试内容'
      });

      res.body.status.should.equal(1);
    } catch(err) {
      should.ifError(err.message);
    }
  });
});
