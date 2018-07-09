const app = require('../../app');
const request = require('supertest')(app);
const should = require('should');
const support = require('../support');

describe('test /api/users/star', function() {
  before(async function() {
    await support.createUser('已注册用户', '18800000000', {
      star: true
    });
  });

  after(async function() {
    await support.deleteUser('18800000000');
  });

  // 正确
  it('should / status 1', async function() {
    try {
      const res = await request.get('/api/users/star');

      res.body.status.should.equal(1);
      res.body.data.should.be.an.Array();
      res.body.data.length.should.equal(1);
    } catch(err) {
      should.ifError(err.message);
    }
  });
});
