const app = require('../../app');
const request = require('supertest')(app);
const should = require('should');

describe('test /api/users/star', function() {
  // 正确
  it('should return status 1', async function() {
    try {
      const res = await request.get('/api/users/star');
      res.body.status.should.equal(1);
      res.body.data.should.be.an.Array();
      res.body.data.length.should.equal(0);
    } catch(err) {
      should.ifError(err.message);
    }
  });
});
