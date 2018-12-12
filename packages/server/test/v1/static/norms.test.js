const app = require('../../../app').listen();
const request = require('supertest')(app);
const should = require('should');

describe('test /v1/static/norms', function() {
  it('should / status 200', async function() {
    try {
      const res = await request.get('/v1/static/norms').expect(200);
      res.text.should.containEql('# 关于薄荷糖社区');
    } catch(err) {
      should.ifError(err.message);
    }
  });
});
