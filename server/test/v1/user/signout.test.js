const app = require('../../app');
const request = require('supertest').agent(app);
const should = require('should');
const support = require('../support');

describe('test /v1/signout', function() {
  let mockUser;

  before(async function() {
    mockUser = await support.createUser(18800000000, '已注册用户');
  });

  after(async function() {
    await support.deleteUser(mockUser.mobile);
  });

  // 正确
  it('should / status 1', async function() {
    try {
      let res;

      res = await request.post('/v1/signin').send({
        mobile: mockUser.mobile,
        password: 'a123456'
      });

      res.body.status.should.equal(1);

      res = await request.delete('/v1/signout');
      res.body.status.should.equal(1);
    } catch(err) {
      should.ifError(err.message);
    }
  });
});
