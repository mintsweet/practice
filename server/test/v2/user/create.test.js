const app = require('../../../app').listen();
const request = require('supertest')(app);
const should = require('should');
const support = require('../../support');

describe('test /v2/users/create', function() {
  let mockUser;
  let mockUser2;

  before(async function() {
    mockUser = await support.createUser('18800000000', '普通用户');
    mockUser2 = await support.createUser('18800000001', '管理员', { role: 1 });
  });

  after(async function() {
    await support.deleteUser(mockUser.mobile);
    await support.deleteUser(mockUser2.mobile);
    await support.deleteUser('18800000002');
  });

  it('should / status 401 when the not signin', async function() {
    try {
      await request.post('/v2/users/create').send({
        mobile: '18800000002',
        password: 'a123456',
        nickname: '新建用户'
      }).expect(401);
    } catch(err) {
      should.ifError(err.message);
    }
  });

  it('should / status 401 when the no permission', async function() {
    try {
      const res = await request.post('/v1/signin').send({
        mobile: mockUser.mobile,
        password: 'a123456'
      }).expect(200);

      await request.post('/v2/users/create').send({
        mobile: '18800000002',
        password: 'a123456',
        nickname: '新建用户',
        role: 0
      }).set('Authorization', res.text).expect(401);
    } catch(err) {
      should.ifError(err.message);
    }
  });

  it('should / status 400 when the mobile is invalid', async function() {
    try {
      let res = await request.post('/v1/signin').send({
        mobile: mockUser2.mobile,
        password: 'a123456'
      }).expect(200);

      res = await request.post('/v2/users/create').send({
        mobile: '1880000000',
        password: 'a123456',
        nickname: '新建用户',
        role: 0
      }).set('Authorization', res.text).expect(400);

      res.body.text = '手机号格式不正确';
    } catch(err) {
      should.ifError(err.message);
    }
  });

  it('should / status 400 when the password is invalid', async function() {
    try {
      let res = await request.post('/v1/signin').send({
        mobile: mockUser2.mobile,
        password: 'a123456'
      }).expect(200);

      res = await request.post('/v2/users/create').send({
        mobile: '18800000002',
        password: '123456',
        nickname: '新建用户',
        role: 0
      }).set('Authorization', res.text).expect(400);

      res.body.text = '密码必须为数字、字母和特殊字符其中两种组成并且在6至18位之间';
    } catch(err) {
      should.ifError(err.message);
    }
  });

  it('should / status 400 when the nickname is invalid', async function() {
    try {
      let res = await request.post('/v1/signin').send({
        mobile: mockUser2.mobile,
        password: 'a123456'
      }).expect(200);

      res = await request.post('/v2/users/create').send({
        mobile: '18800000002',
        password: 'a123456',
        nickname: '新',
        role: 0
      }).set('Authorization', res.text).expect(400);

      res.body.text = '昵称必须在2至8位之间';
    } catch(err) {
      should.ifError(err.message);
    }
  });

  it('should / status 400 when the role is invalid', async function() {
    try {
      let res = await request.post('/v1/signin').send({
        mobile: mockUser2.mobile,
        password: 'a123456'
      }).expect(200);

      res = await request.post('/v2/users/create').send({
        mobile: '18800000002',
        password: 'a123456',
        nickname: '新建用户',
        role: 10
      }).set('Authorization', res.text).expect(400);

      res.body.text = '权限值必须在0至100之间、且不能大于当前用户的权限值';
    } catch(err) {
      should.ifError(err.message);
    }
  });

  it('should / status 409 when the mobile is registered', async function() {
    try {
      let res = await request.post('/v1/signin').send({
        mobile: mockUser2.mobile,
        password: 'a123456'
      }).expect(200);

      res = await request.post('/v2/users/create').send({
        mobile: mockUser.mobile,
        password: 'a123456',
        nickname: '新建用户',
        role: 0
      }).set('Authorization', res.text).expect(409);

      res.body.text = '手机号已经存在';
    } catch(err) {
      should.ifError(err.message);
    }
  });

  it('should / status 409 when the nickname is registered', async function() {
    try {
      let res = await request.post('/v1/signin').send({
        mobile: mockUser2.mobile,
        password: 'a123456'
      }).expect(200);

      res = await request.post('/v2/users/create').send({
        mobile: '18800000002',
        password: 'a123456',
        nickname: mockUser.nickname,
        role: 0
      }).set('Authorization', res.text).expect(409);

      res.body.text = '昵称已经存在';
    } catch(err) {
      should.ifError(err.message);
    }
  });

  it('should / status 200', async function() {
    try {
      const res = await request.post('/v1/signin').send({
        mobile: mockUser2.mobile,
        password: 'a123456'
      }).expect(200);

      await request.post('/v2/users/create').send({
        mobile: '18800000002',
        password: 'a123456',
        nickname: '新建用户',
        role: 0
      }).set('Authorization', res.text).expect(200);
    } catch(err) {
      should.ifError(err.message);
    }
  });
});
