const app = require('../../app');
const request = require('supertest')(app);
const should = require('should');

describe('test /api/captcha/pic', function() {
  it('should return status 1', function(done) {
    request
      .get('/api/captcha/pic')
      .end(function(err, res) {
        should.not.exist(err);
        res.body.status.should.equal(1);
        res.body.data.token.length.should.equal(5);
        done();
      });
  });
});