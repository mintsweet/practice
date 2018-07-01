const app = require('../../app');
const request = require('supertest')(app);
const should = require('should');

describe('test /api/static/api_introduction', function() {
  it('should return status 1', function(done) {
    request
      .get('/api/static/api_introduction')
      .end(function(err, res) {
        should.not.exist(err);
        res.body.status.should.equal(1);
        res.body.data.should.containEql('API说明');
        done(err);
      });
  });
});
