const app = require('../../../app').listen();
const request = require('supertest')(app);
const should = require('should');

describe('test /v1/static/about', function() {
  it('should / status 200', async function() {
    try {
      const res = await request.get('/v1/static/about');

      res.status.should.equal(200);
      res.text.should.containEql('# 关于');
    } catch(err) {
      should.ifError(err.message);
    }
  });
});
