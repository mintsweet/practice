const app = require('../../app');
const request = require('supertest')(app);
const should = require('should');

describe('test /controllers/static.js', function() {
  it('should get /quick_start', async function() {
    try {
      const res = await request.get('/quick_start').expect(200);

      res.text.should.containEql('快速开始');
    } catch(err) {
      should.ifError(err.message);
    }
  });

  it('should get /api_doc', async function() {
    try {
      const res = await request.get('/api_doc').expect(200);

      res.text.should.containEql('API文档');
    } catch(err) {
      should.ifError(err.message);
    }
  });

  it('should get /about', async function() {
    try {
      const res = await request.get('/about').expect(200);

      res.text.should.containEql('关于');
    } catch(err) {
      should.ifError(err.message);
    }
  });
});
