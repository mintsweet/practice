const app = require('../../../app').listen();
const request = require('supertest')(app);
const should = require('should');
const support = require('../../support');

describe('test /v2/users/create', function() {
  let mockUser;
  let mockUser2;

  before(async function() {
    mockUser = await support.createUser('123456@qq.com', '普通用户');
    mockUser2 = await support.createUser('123457@qq.com', '管理员', { role: 1 });
  });

  after(async function() {
    await support.deleteUser(mockUser.email);
    await support.deleteUser(mockUser2.email);
    await support.deleteUser('123458@qq.com');
  });

  it('should / status 401 when the not signin', async function() {
    try {
      const res = await request
        .post('/v2/users/create')
        .send({
          email: '123458@qq.com',
          password: 'a123456',
          nickname: '新建用户'
        })
        .expect(401);

      res.text.should.equal('尚未登录');
    } catch(err) {
      should.ifError(err.message);
    }
  });

  it('should / status 403 when the no permission', async function() {
    try {
      let res = await request
        .post('/signin')
        .send({
          email: mockUser.email,
          password: 'a123456'
        })
        .expect(200);

      res = await request
        .post('/v2/users/create')
        .send({
          email: '123458@qq.com',
          password: 'a123456',
          nickname: '新建用户',
          role: 0
        })
        .set('Authorization', res.text)
        .expect(403);

      res.text.should.equal('需要管理员权限');
    } catch(err) {
      should.ifError(err.message);
    }
  });

  it('should / status 400 when the email is invalid', async function() {
    try {
      let res = await request
        .post('/signin')
        .send({
          email: mockUser2.email,
          password: 'a123456'
        })
        .expect(200);

      res = await request
        .post('/v2/users/create')
        .send({
          email: '1234568@qq',
          password: 'a123456',
          nickname: '新建用户',
          role: 0
        })
        .set('Authorization', res.text)
        .expect(400);

      res.text.should.equal('邮箱格式不正确');
    } catch(err) {
      should.ifError(err.message);
    }
  });

  it('should / status 400 when the password is invalid', async function() {
    try {
      let res = await request
        .post('/signin')
        .send({
          email: mockUser2.email,
          password: 'a123456'
        })
        .expect(200);

      res = await request
        .post('/v2/users/create')
        .send({
          email: '123458@qq.com',
          password: '123456',
          nickname: '新建用户',
          role: 0
        })
        .set('Authorization', res.text)
        .expect(400);

      res.text.should.equal('密码必须为数字、字母和特殊字符其中两种组成并且在6至18位之间');
    } catch(err) {
      should.ifError(err.message);
    }
  });

  it('should / status 400 when the nickname is invalid', async function() {
    try {
      let res = await request
        .post('/signin')
        .send({
          email: mockUser2.email,
          password: 'a123456'
        })
        .expect(200);

      res = await request
        .post('/v2/users/create')
        .send({
          email: '123458@qq.com',
          password: 'a123456',
          nickname: '新',
          role: 0
        })
        .set('Authorization', res.text)
        .expect(400);

      res.text.should.equal('昵称必须在2至8位之间');
    } catch(err) {
      should.ifError(err.message);
    }
  });

  it('should / status 400 when the role is invalid', async function() {
    try {
      let res = await request
        .post('/signin')
        .send({
          email: mockUser2.email,
          password: 'a123456'
        })
        .expect(200);

      res = await request
        .post('/v2/users/create')
        .send({
          email: '123458@qq.com',
          password: 'a123456',
          nickname: '新建用户',
          role: 10
        })
        .set('Authorization', res.text)
        .expect(400);

      res.text.should.equal('权限值必须在0至100之间、且不能大于当前用户的权限值');
    } catch(err) {
      should.ifError(err.message);
    }
  });

  it('should / status 409 when the email is registered', async function() {
    try {
      let res = await request
        .post('/signin')
        .send({
          email: mockUser2.email,
          password: 'a123456'
        })
        .expect(200);

      res = await request
        .post('/v2/users/create')
        .send({
          email: mockUser.email,
          password: 'a123456',
          nickname: '新建用户',
          role: 0
        })
        .set('Authorization', res.text)
        .expect(409);

      res.text.should.equal('手机号已经存在');
    } catch(err) {
      should.ifError(err.message);
    }
  });

  it('should / status 409 when the nickname is registered', async function() {
    try {
      let res = await request
        .post('/signin')
        .send({
          email: mockUser2.email,
          password: 'a123456'
        })
        .expect(200);

      res = await request
        .post('/v2/users/create')
        .send({
          email: '123458@qq.com',
          password: 'a123456',
          nickname: mockUser.nickname,
          role: 0
        })
        .set('Authorization', res.text)
        .expect(409);

      res.text.should.equal('昵称已经存在');
    } catch(err) {
      should.ifError(err.message);
    }
  });

  it('should / status 200', async function() {
    try {
      const res = await request
        .post('/signin')
        .send({
          email: mockUser2.email,
          password: 'a123456'
        })
        .expect(200);

      await request
        .post('/v2/users/create')
        .send({
          email: '123458@qq.com',
          password: 'a123456',
          nickname: '新建用户',
          role: 0
        })
        .set('Authorization', res.text)
        .expect(200);
    } catch(err) {
      should.ifError(err.message);
    }
  });
});
