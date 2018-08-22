const app = require('../../../app').listen();
const request = require('supertest')(app);
const should = require('should');
const support = require('../../support');

describe('test /v2/user/:uid/star', function() {
  let mockUser;
  let mockUser2;
  let mockUser3;

  before(async function() {
    mockUser = await support.createUser('18800000000', '普通用户');
    mockUser2 = await support.createUser('18800000001', '管理员', { role: 1 });
    mockUser3 = await support.createUser('18800000002', '管理员二号', { role: 10 });
  });

  after(async function() {
    await support.deleteUser(mockUser.mobile);
    await support.deleteUser(mockUser2.mobile);
    await support.deleteUser(mockUser3.mobile);
  });

  it('should / status 401 when the not sigin', async function() {
    try {
      const res = await request.patch(`/v2/user/${mockUser.id}/star`).expect(401);

      res.body.text = '需要管理员权限';
    } catch(err) {
      should.ifError(err.message);
    }
  });

  it('should / status 401 when the no permission', async function() {
    try {
      let res = await request.post('/v1/signin').send({
        mobile: mockUser.mobile,
        password: 'a123456'
      }).expect(200);

      res = await request.patch(`/v2/user/${mockUser.id}/star`).set('Authorization', res.text).expect(401);

      res.body.text = '需要管理员权限';
    } catch(err) {
      should.ifError(err.message);
    }
  });

  it('should / status 403 when the user is you', async function() {
    try {
      let res = await request.post('/v1/signin').send({
        mobile: mockUser2.mobile,
        password: 'a123456'
      }).expect(200);

      res = await request.patch(`/v2/user/${mockUser2.id}/star`).set('Authorization', res.text).expect(403);

      res.body.text = '不能操作自身';
    } catch(err) {
      should.ifError(err.message);
    }
  });

  it('should / status 403 when the user role more than yours', async function() {
    try {
      let res = await request.post('/v1/signin').send({
        mobile: mockUser2.mobile,
        password: 'a123456'
      }).expect(200);

      res = await request.patch(`/v2/user/${mockUser3.id}/star`).set('Authorization', res.text).expect(403);

      res.body.text = '不能操作权限值高于自身的用户';
    } catch(err) {
      should.ifError(err.message);
    }
  });

  it('should / status 200 when the action is star', async function() {
    try {
      let res = await request.post('/v1/signin').send({
        mobile: mockUser2.mobile,
        password: 'a123456'
      }).expect(200);

      res = await request.patch(`/v2/user/${mockUser.id}/star`).set('Authorization', res.text).expect(200);

      res.body.text = 'star';
    } catch(err) {
      should.ifError(err.message);
    }
  });

  it('should / status 200 when the action is un_star', async function() {
    try {
      let res = await request.post('/v1/signin').send({
        mobile: mockUser2.mobile,
        password: 'a123456'
      }).expect(200);

      res = await request.patch(`/v2/user/${mockUser.id}/star`).set('Authorization', res.text).expect(200);

      res.body.text = 'un_star';
    } catch(err) {
      should.ifError(err.message);
    }
  });
});
