const app = require('../../app');
const request = require('supertest')(app);
const should = require('should');

describe('test /api/static/api_introduction', function() {
  // 正确
  it('should return status 1', async function() {
    try {
      const res = await request.get('/api/static/get_start');
      res.body.status.should.equal(1);
      res.body.data.should.containEql('快速开始');
    } catch(err) {
      should.ifError(err.message);
    }
  });
});
