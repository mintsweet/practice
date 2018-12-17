const app = require('../../../app').listen();
const request = require('supertest')(app);
const should = require('should');
const support = require('../../support');

describe('test /v1/create', function() {
  let mockUser;

  before(async function() {
    mockUser = await support.createUser('123456@qq.com', '话题创建者');
  });

  after(async function() {
    await support.deleteAction(mockUser.id);
    await support.deleteTopic({ author_id: mockUser.id });
    await support.deleteUser(mockUser.email);
  });

  it('should / status 401 when the not signin', async function() {
    try {
      const res = await request.post('/v1/create').send({
        tab: 'ask',
        title: '测试标题',
        content: '# 哈哈哈哈哈测试内容'
      }).expect(401);

      res.text.should.equal('尚未登录');
    } catch(err) {
      should.ifError(err.message);
    }
  });

  it('should / status 400 when the tab is invalid', async function() {
    try {
      let res = await request.post('/v1/signin').send({
        email: mockUser.email,
        password: 'a123456'
      }).expect(200);

      res = await request.post('/v1/create').send({
        title: '测试标题',
        content: '# 哈哈哈哈哈测试内容'
      }).set('Authorization', res.text).expect(400);

      res.text.should.equal('话题所属标签不能为空');
    } catch(err) {
      should.ifError(err.message);
    }
  });

  it('should / status 400 when the title is invalid', async function() {
    try {
      let res = await request.post('/v1/signin').send({
        email: mockUser.email,
        password: 'a123456'
      }).expect(200);

      res = await request.post('/v1/create').send({
        tab: 'ask',
        content: '# 哈哈哈哈哈测试内容'
      }).set('Authorization', res.text).expect(400);

      res.text.should.equal('话题标题不能为空');
    } catch(err) {
      should.ifError(err.message);
    }
  });

  it('should / status 400 when the content is invalid', async function() {
    try {
      let res = await request.post('/v1/signin').send({
        email: mockUser.email,
        password: 'a123456'
      }).expect(200);

      res = await request.post('/v1/create').send({
        tab: 'ask',
        title: '测试标题'
      }).set('Authorization', res.text).expect(400);

      res.text.should.equal('话题内容不能为空');
    } catch(err) {
      should.ifError(err.message);
    }
  });

  it('should / status 200', async function() {
    try {
      const res = await request.post('/v1/signin').send({
        email: mockUser.email,
        password: 'a123456'
      }).expect(200);

      await request
        .post('/v1/create')
        .send({
          tab: 'ask',
          title: '测试标题',
          content: '# 哈哈哈哈哈测试内容'
        })
        .set('Authorization', res.text)
        .expect(200);
    } catch(err) {
      should.ifError(err.message);
    }
  });
});
