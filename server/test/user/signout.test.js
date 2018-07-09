const app = require('../../app');
const request = require('supertest').agent(app);
const should = require('should');
const support = require('../support');

describe('test /api/signout', function() {
  let mockUser;

  before(async function() {
    mockUser = await support.createUser('已注册用户', '18800000000');
  });

  after(async function() {
    await support.deleteUser(mockUser.mobile);
  });

  // 正确
  it('should / status 1', async function() {
    try {
      let res;

      res = await request.post('/api/signin').send({
        mobile: mockUser.mobile,
        password: 'a123456'
      });

      res.body.status.should.equal(1);
      res.body.data.should.have.property('id');
      res.body.data.id.should.equal(mockUser.id);

      res = await request.delete('/api/signout');
      res.body.status.should.equal(1);
    } catch(err) {
      should.ifError(err.message);
    }
  });
});
