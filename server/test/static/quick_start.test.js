const app = require('../../app');
const request = require('supertest')(app);
const should = require('should');

describe('test /v1/static/quick_start', function() {
  // 正确
  it('should / status 1', async function() {
    try {
      const res = await request.get('/v1/static/quick_start');

      res.body.status.should.equal(1);
      res.body.data.should.containEql('快速开始');
    } catch(err) {
      should.ifError(err.message);
    }
  });
});
