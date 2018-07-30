const app = require('../../../app').listen();
const request = require('supertest')(app);
const should = require('should');

describe('test /v1/static/api_doc', function() {
  it('should / status 200', async function() {
    try {
      const res = await request.get('/v1/static/api_doc').expect(200);

      res.text.should.containEql('# API文档');
    } catch(err) {
      should.ifError(err.message);
    }
  });
});
