const app = require('../../app').listen();
const request = require('supertest')(app);
const should = require('should');
const support = require('../support');

describe('test post /backend/topic', function() {
  let mockUser;
  let mockUser2;

  before(async function() {
    mockUser = await support.createUser('123456@qq.com');
    mockUser2 = await support.createUser('123457@qq.com', {
      nickname: '管理员',
      role: 1,
    });
  });

  after(async function() {
    await support.deleteUser(mockUser.email);
    await support.deleteAction(mockUser2._id);
    await support.deleteTopic(mockUser2._id);
    await support.deleteUser(mockUser2.email);
  });

  it('should / status 401 when the not signin', async function() {
    try {
      const res = await request
        .post('/backend/topic')
        .send({
          tab: 'ask',
          title: '测试标题',
          content: '# 哈哈哈哈哈测试内容',
        })
        .expect(401);

      res.text.should.equal('尚未登录');
    } catch (err) {
      should.ifError(err.message);
    }
  });

  it('should / status 403 when the no permission', async function() {
    try {
      let res = await request
        .post('/signin')
        .send({
          email: mockUser.email,
          password: 'a123456',
        })
        .expect(200);

      res = await request
        .get('/backend/topics')
        .set('Authorization', res.text)
        .expect(403);

      res.text.should.equal('权限不足');
    } catch (err) {
      should.ifError(err.message);
    }
  });

  it('should / status 400 when the tab is invalid', async function() {
    try {
      let res = await request
        .post('/signin')
        .send({
          email: mockUser2.email,
          password: 'a123456',
        })
        .expect(200);

      res = await request
        .post('/backend/topic')
        .send({
          title: '测试标题',
          content: '# 哈哈哈哈哈测试内容',
        })
        .set('Authorization', res.text)
        .expect(400);

      res.text.should.equal('话题标签不能为空');
    } catch (err) {
      should.ifError(err.message);
    }
  });

  it('should / status 400 when the title is invalid', async function() {
    try {
      let res = await request
        .post('/signin')
        .send({
          email: mockUser2.email,
          password: 'a123456',
        })
        .expect(200);

      res = await request
        .post('/backend/topic')
        .send({
          tab: 'ask',
          content: '# 哈哈哈哈哈测试内容',
        })
        .set('Authorization', res.text)
        .expect(400);

      res.text.should.equal('话题标题不能为空');
    } catch (err) {
      should.ifError(err.message);
    }
  });

  it('should / status 400 when the content is invalid', async function() {
    try {
      let res = await request
        .post('/signin')
        .send({
          email: mockUser2.email,
          password: 'a123456',
        })
        .expect(200);

      res = await request
        .post('/backend/topic')
        .send({
          tab: 'ask',
          title: '测试标题',
        })
        .set('Authorization', res.text)
        .expect(400);

      res.text.should.equal('话题内容不能为空');
    } catch (err) {
      should.ifError(err.message);
    }
  });

  it('should / status 200', async function() {
    try {
      const res = await request
        .post('/signin')
        .send({
          email: mockUser2.email,
          password: 'a123456',
        })
        .expect(200);

      await request
        .post('/backend/topic')
        .send({
          tab: 'ask',
          title: '测试标题',
          content: '# 哈哈哈哈哈测试内容',
        })
        .set('Authorization', res.text)
        .expect(200);
    } catch (err) {
      should.ifError(err.message);
    }
  });
});
