const app = require('../../app');
const request = require('supertest')(app);
const should = require('should');

describe('test /v1/static/about', function() {
  // 正确
  it('should / status 1', async function() {
    try {
      const res = await request.get('/v1/static/about');

      res.body.status.should.equal(1);
      res.body.data.should.containEql('关于');
    } catch(err) {
      should.ifError(err.message);
    }
  });
});
