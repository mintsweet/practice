const app = require('../../app');
const request = require('supertest')(app);
const should = require('should');

describe('test /api/static/api_introduction', function() {
  // 正确
  it('should return status 1', async function() {
    try {
      const res = await request.get('/api/static/api_introduction');
      res.body.status.should.equal(1);
      res.body.data.should.containEql('API说明');
    } catch(err) {
      should.ifError(err.message);
    }
  });
});
