const app = require('../../../app').listen();
const request = require('supertest')(app);
const should = require('should');
const support = require('../../support');

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

  it('should / status 401 when the not signin', async function() {
    try {
      const res = await request.post('/v1/create').send({
        tab: 'ask',
        title: '测试标题',
        content: '# 哈哈哈哈哈测试内容'
      });

      res.status.should.equal(401);
      res.error.text.should.equal('需要用户登录权限');
    } catch(err) {
      should.ifError(err.message);
    }
  });

  it('should / status 400 when the tab is invalid', async function() {
    try {
      let res;

      res = await request.post('/v1/signin').send({
        mobile: mockUser.mobile,
        password: 'a123456'
      });

      res.status.should.equal(200);

      res = await request.post('/v1/create').send({
        title: '测试标题',
        content: '# 哈哈哈哈哈测试内容'
      }).set('Authorization', res.text);

      res.status.should.equal(400);
      res.error.text.should.equal('话题所属标签不能为空');
    } catch(err) {
      should.ifError(err.message);
    }
  });

  it('should / status 400 when the title is invalid', async function() {
    try {
      let res;

      res = await request.post('/v1/signin').send({
        mobile: mockUser.mobile,
        password: 'a123456'
      });

      res.status.should.equal(200);

      res = await request.post('/v1/create').send({
        tab: 'ask',
        content: '# 哈哈哈哈哈测试内容'
      }).set('Authorization', res.text);

      res.status.should.equal(400);
      res.error.text.should.equal('话题标题不能为空');
    } catch(err) {
      should.ifError(err.message);
    }
  });

  it('should / status 400 when the content is invalid', async function() {
    try {
      let res;

      res = await request.post('/v1/signin').send({
        mobile: mockUser.mobile,
        password: 'a123456'
      });

      res.status.should.equal(200);

      res = await request.post('/v1/create').send({
        tab: 'ask',
        title: '测试标题'
      }).set('Authorization', res.text);

      res.status.should.equal(400);
      res.error.text.should.equal('话题内容不能为空');
    } catch(err) {
      should.ifError(err.message);
    }
  });

  it('should / status 200', async function() {
    try {
      let res;

      res = await request.post('/v1/signin').send({
        mobile: mockUser.mobile,
        password: 'a123456'
      });

      res.status.should.equal(200);

      res = await request.post('/v1/create').send({
        tab: 'ask',
        title: '测试标题',
        content: '# 哈哈哈哈哈测试内容'
      }).set('Authorization', res.text);

      res.status.should.equal(200);
    } catch(err) {
      should.ifError(err.message);
    }
  });
});
