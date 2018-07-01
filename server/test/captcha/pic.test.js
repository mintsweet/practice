const app = require('../../app');
const request = require('supertest')(app);
const should = require('should');

describe('test /api/captcha/pic', function() {
  // 正确
  it('should return status 1', async function() {
    try {
      const res = await request.get('/api/captcha/pic');
      res.body.status.should.equal(1);
      res.body.data.token.length.should.equal(5);
    } catch(err) {
      should.ifError(err.message);
    }
  });
});
