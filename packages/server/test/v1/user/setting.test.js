const app = require('../../../app').listen();
const request = require('supertest')(app);
const should = require('should');
const support = require('../../support');

describe('test /v1/setting', function() {
  let mockUser;
  let mockUser2;

  before(async function() {
    mockUser = await support.createUser('123456@qq.com', '已注册用户一');
    mockUser2 = await support.createUser('123457@qq.com', '已注册用户二');
  });

  after(async function() {
    await support.deleteUser(mockUser.email);
    await support.deleteUser(mockUser2.email);
  });

  it('should / status 401 when user is not signin', async function() {
    try {
      const res = await request
        .put('/v1/setting')
        .send({
          nickname: '青湛',
          location: '四川，成都',
          signature: '我是光'
        })
        .expect(401);

      res.text.should.equal('尚未登录');
    } catch(err) {
      should.ifError(err.message);
    }
  });

  it('should / status 409 when nickname is registered', async function() {
    try {
      let res = await request
        .post('/v1/signin')
        .send({
          email: mockUser.email,
          password: 'a123456'
        })
        .expect(200);

      res = await request
        .put('/v1/setting')
        .send({
          nickname: mockUser2.nickname,
          location: '四川，成都',
          signature: '我是光'
        })
        .set('Authorization', res.text)
        .expect(409);

      res.text.should.equal('昵称已经注册过了');
    } catch(err) {
      should.ifError(err.message);
    }
  });

  it('should / status 200', async function() {
    try {
      const res = await request
        .post('/v1/signin')
        .send({
          email: mockUser.email,
          password: 'a123456'
        })
        .expect(200);

      await request.put('/v1/setting')
        .send({
          nickname: '用户改名',
          location: '四川，成都',
          signature: '我是光'
        })
        .set('Authorization', res.text)
        .expect(200);
    } catch(err) {
      should.ifError(err.message);
    }
  });
});

