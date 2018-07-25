const app = require('../../../app').listen();
const request = require('supertest')(app);
const should = require('should');

describe('test /v1/captcha/pic', function() {
  it('should / 200', async function() {
    try {
      const res = await request.get('/v1/captcha/pic');
      res.status.should.equal(200);
      res.body.token.length.should.equal(5);
    } catch(err) {
      should.ifError(err.message);
    }
  });
});
