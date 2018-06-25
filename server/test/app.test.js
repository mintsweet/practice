const request = require('supertest');
const app = require('../app');
const config = require('../../config.default');

describe('test/app.test.js', function() {
  it('should / status 200', function(done) {
    request(app)
      .get('/')
      .end(function(err, res) {
        res.status.should.equal(200);
        res.text.should.containEql(config.description);
        done();
      });
  });
});