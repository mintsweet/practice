const app = require('../app');
const request = require('supertest')(app);
const should = require('should');
const config = require('../../config.default');

describe('test /app.test.js', function() {
  it('should / status 200', async function() {
    try {
      const res = await request.get('/');
      res.status.should.equal(200);
      res.text.should.containEql(config.description);
    } catch(err) {
      should.not.exist(err);
    }
  });
});
