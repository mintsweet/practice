const app = require('../../../app').listen();
const request = require('supertest')(app);
const should = require('should');
const support = require('../../support');

describe('test /v2/topics/list', async function() {
  let mockUser;
  let mockUser2;

  before(async function() {
    mockUser = await support.createUser('18800000000', '普通用户');
    mockUser2 = await support.createUser('18800000001', '管理员', { role: 1 });
  });

  after(async function() {
    await support.deleteUser(mockUser.mobile);
    await support.deleteUser(mockUser2.mobile);
  });

  it('should / status 401 when the not signin', async function() {
    try {
      const res = await request.get('/v2/topics/list').expect(401);

      res.body.text = '需要用户权限';
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

      res = await request.get('/v2/topics/list').set('Authorization', res.text).expect(401);

      res.body.text = '需要管理员权限';
    } catch(err) {
      should.ifError(err.message);
    }
  });

  it('should / status 200', async function() {
    try {
      let res = await request.post('/v1/signin').send({
        mobile: mockUser2.mobile,
        password: 'a123456'
      }).expect(200);

      res = await request.get('/v2/topics/list').set('Authorization', res.text).expect(200);

      res.body.text = 0;
    } catch(err) {
      should.ifError(err.message);
    }
  });
});
