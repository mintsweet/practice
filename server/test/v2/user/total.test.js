const app = require('../../../app').listen();
const request = require('supertest')(app);
const should = require('should');
const support = require('../../support');

describe('test /v2/user/total', function() {
  let mockUser;

  before(async function() {
    mockUser = await support.createUser('18800000000', '管理员', { role: 1 });
  });

  after(async function() {
    await support.deleteUser(mockUser.mobile);
  });

  it('should / status 401 when the insufficient permissions', async function() {
    try {
      await request.get('/v2/user/total').expect(401);
    } catch(err) {
      should.ifError(err.message);
    }
  });

  it('should / status 200', async function() {
    try {
      const res = await request.post('/v1/signin').send({
        mobile: mockUser.mobile,
        password: 'a123456'
      }).expect(200);

      await request.get('/v2/user/total').set('Authorization', res.text).expect(200);
    } catch(err) {
      should.ifError(err.message);
    }
  });
});
