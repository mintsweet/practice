const app = require('../../app');
const request = require('supertest')(app);
const should = require('should');

describe('test /v1/aider/captcha', function() {
  it('should / status 1', async function() {
    try {
      const res = await request.get('/v1/aider/captcha');

      res.body.status.should.equal(1);
      res.body.data.token.length.should.equal(5);
    } catch(err) {
      should.ifError(err.message);
    }
  });
});
