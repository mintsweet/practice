const app = require('../../../app').listen();
const request = require('supertest')(app);
const should = require('should');
const support = require('../../support');

describe('test /v2/user/:uid/delete', function() {
  let mockUser;
  let mockUser2;
  let mockUser3;

  before(async function() {
    mockUser = await support.createUser('18800000000', '待删用户');
    mockUser2 = await support.createUser('18800000001', '管理员', { role: 1 });
    mockUser3 = await support.createUser('18800000002', '超级管理员', { role: 101 });
  });

  after(async function() {
    await support.deleteUser(mockUser2.mobile);
    await support.deleteUser(mockUser3.mobile);
  });

  it('should / status 401 when the not signin', async function() {
    try {
      const res = await request.delete(`/v2/user/${mockUser.id}/delete`).expect(401);

      res.body.text = '需要超级管理员权限';
    } catch(err) {
      should.ifError(err.message);
    }
  });

  it('should / status 401 when the no permission', async function() {
    try {
      let res = await request.post('/v1/signin').send({
        mobile: mockUser2.mobile,
        password: 'a123456'
      }).expect(200);

      res = await request.delete(`/v2/user/${mockUser.id}/delete`).set('Authorization', res.text).expect(401);

      res.body.text = '需要超级管理员权限';
    } catch(err) {
      should.ifError(err.message);
    }
  });

  it('should / status 401 when the user is root', async function() {
    try {
      let res = await request.post('/v1/signin').send({
        mobile: mockUser3.mobile,
        password: 'a123456'
      }).expect(200);

      res = await request.delete(`/v2/user/${mockUser3.id}/delete`).set('Authorization', res.text).expect(401);

      res.body.text = '无法删除超级管理员';
    } catch(err) {
      should.ifError(err.message);
    }
  });

  it('should / status 200', async function() {
    try {
      const res = await request.post('/v1/signin').send({
        mobile: mockUser3.mobile,
        password: 'a123456'
      }).expect(200);

      await request.delete(`/v2/user/${mockUser.id}/delete`).set('Authorization', res.text).expect(200);
    } catch(err) {
      should.ifError(err.message);
    }
  });
});
