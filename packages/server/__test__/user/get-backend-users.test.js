const app = require('../../app').listen();
const request = require('supertest')(app);
const should = require('should');
const support = require('../support');

describe('test get /backend/users', async function() {
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
    await support.deleteUser(mockUser2.email);
  });

  it('should / status 401 when the not signin', async function() {
    try {
      const res = await request.get('/backend/users').expect(401);

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
        .get('/backend/users')
        .set('Authorization', res.text)
        .expect(403);

      res.text.should.equal('权限不足');
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
        .get('/backend/users')
        .set('Authorization', res.text)
        .expect(200);

      res.body.list.length.should.equal(2);
      res.body.total.should.equal(2);
    } catch (err) {
      should.ifError(err.message);
    }
  });
});
