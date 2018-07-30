const app = require('../../../app').listen();
const request = require('supertest')(app);
const should = require('should');
const support = require('../../support');

describe('test /v1/info', function() {
  let mockUser;

  before(async function() {
    mockUser = await support.createUser('18800000000', '已注册用户');
  });

  after(async function() {
    await support.deleteUser(mockUser.mobile);
  });

  it('should / status 401 when the not signin', async function() {
    try {
      const res = await request.get('/v1/info').expect(401);

      res.text.should.equal('需要用户权限');
    } catch(err) {
      should.ifError(err.message);
    }
  });

  it('should / status 200', async function() {
    try {
      let res = await request.post('/v1/signin').send({
        mobile: mockUser.mobile,
        password: 'a123456'
      }).expect(200);

      res = await request.get('/v1/info').set('Authorization', res.text).expect(200);

      res.body.should.have.property('id');
      res.body.id.should.equal(mockUser.id);
    } catch(err) {
      should.ifError(err.message);
    }
  });
});
