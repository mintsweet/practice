const app = require('../../../app').listen();
const request = require('supertest')(app);
const should = require('should');
const support = require('../../support');

describe('test /v2/user/:uid/star', function() {
  let mockUser;
  let mockUser2;

  before(async function() {
    mockUser = await support.createUser('123456@qq.com', '普通用户');
    mockUser2 = await support.createUser('123457@qq.com', '管理员', { role: 101 });
  });

  after(async function() {
    await support.deleteUser(mockUser.email);
    await support.deleteUser(mockUser2.email);
  });

  it('should / status 401 when the not sigin', async function() {
    try {
      const res = await request
        .patch(`/v2/user/${mockUser.id}/star`)
        .expect(401);

      res.text.should.equal('尚未登录');
    } catch(err) {
      should.ifError(err.message);
    }
  });

  it('should / status 403 when the no permission', async function() {
    try {
      let res = await request
        .post('/v1/signin')
        .send({
          email: mockUser.email,
          password: 'a123456'
        })
        .expect(200);

      res = await request
        .patch(`/v2/user/${mockUser.id}/star`)
        .set('Authorization', res.text)
        .expect(403);

      res.text.should.equal('需要超级管理员权限');
    } catch(err) {
      should.ifError(err.message);
    }
  });

  it('should / status 403 when the user is you', async function() {
    try {
      let res = await request
        .post('/v1/signin')
        .send({
          email: mockUser2.email,
          password: 'a123456'
        })
        .expect(200);

      res = await request
        .patch(`/v2/user/${mockUser2.id}/star`)
        .set('Authorization', res.text)
        .expect(403);

      res.text.should.equal('不能操作自身');
    } catch(err) {
      should.ifError(err.message);
    }
  });

  it('should / status 200 when the action is star', async function() {
    try {
      let res = await request
        .post('/v1/signin')
        .send({
          email: mockUser2.email,
          password: 'a123456'
        })
        .expect(200);

      res = await request
        .patch(`/v2/user/${mockUser.id}/star`)
        .set('Authorization', res.text)
        .expect(200);

      res.text.should.equal('star');
    } catch(err) {
      should.ifError(err.message);
    }
  });

  it('should / status 200 when the action is un_star', async function() {
    try {
      let res = await request
        .post('/v1/signin')
        .send({
          email: mockUser2.email,
          password: 'a123456'
        })
        .expect(200);

      res = await request
        .patch(`/v2/user/${mockUser.id}/star`)
        .set('Authorization', res.text)
        .expect(200);

      res.text.should.equal('un_star');
    } catch(err) {
      should.ifError(err.message);
    }
  });
});
