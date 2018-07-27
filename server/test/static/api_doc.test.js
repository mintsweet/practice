const app = require('../../app');
const request = require('supertest')(app);
const should = require('should');

describe('test /v1/static/api_doc', function() {
  // 正确
  it('should / status 1', async function() {
    try {
      const res = await request.get('/v1/static/api_doc');

      res.body.status.should.equal(1);
      res.body.data.should.containEql('API文档');
    } catch(err) {
      should.ifError(err.message);
    }
  });
});
