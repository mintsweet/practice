const app = require('../../../app').listen();
const request = require('supertest')(app);
const should = require('should');

describe('test /v1/static/qucik_start', function() {
  it('should / status 200', async function() {
    try {
      const res = await request.get('/v1/static/quick_start').expect(200);

      res.text.should.containEql('# 快速开始');
    } catch(err) {
      should.ifError(err.message);
    }
  });
});
