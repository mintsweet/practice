const app = require('../../app').listen();
const request = require('supertest')(app);
const should = require('should');
const support = require('../support');

describe('test put /backend/user/:uid', function() {
  let mockUser;
  let mockUser2;

  before(async function() {
    mockUser = await support.createUser('123456@qq.com');
    mockUser2 = await support.createUser('123457@qq.com', {
      nickname: '管理员',
      role: 101,
    });
  });

  after(async function() {
    await support.deleteUser(mockUser.email);
    await support.deleteUser(mockUser2.email);
  });

  it('should / status 401 when the not sigin', async function() {
    try {
      const res = await request
        .put(`/backend/user/${mockUser._id}`)
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
        .put(`/backend/user/${mockUser2._id}`)
        .set('Authorization', res.text)
        .expect(403);

      res.text.should.equal('权限不足');
    } catch (err) {
      should.ifError(err.message);
    }
  });

  it('should / status 409 when the nickname is registered', async function() {
    try {
      let res = await request
        .post('/signin')
        .send({
          email: mockUser2.email,
          password: 'a123456',
        })
        .expect(200);

      res = await request
        .put(`/backend/user/${mockUser._id}`)
        .send({
          nickname: mockUser2.nickname,
        })
        .set('Authorization', res.text)
        .expect(409);

      res.text.should.equal('昵称已经注册过了');
    } catch (err) {
      should.ifError(err.message);
    }
  });

  it('should / status 200', async function() {
    try {
      let res = await request
        .post('/signin')
        .send({
          email: mockUser2.email,
          password: 'a123456',
        })
        .expect(200);

      res = await request
        .put(`/backend/user/${mockUser._id}`, {
          nickname: '修改昵称',
        })
        .set('Authorization', res.text)
        .expect(200);

      res.text.should.equal('');
    } catch (err) {
      should.ifError(err.message);
    }
  });
});
