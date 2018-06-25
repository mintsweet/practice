const should = require('should');
const app = require('../../app');
const request = require('supertest')(app);

describe('test/controllers/static', function() {
  it('should get /get_start', function(done) {
    request.get('/api/static/get_start')
      .expect(200)
      .end(function(err, res) {
        res.text.should.containEql('status');
        done(err);
      });
  });

  it('should get /api_introduction', function(done) {
    request.get('/api/static/api_introduction')
      .expect(200)
      .end(function(err, res) {
        res.text.should.containEql('status');
        done(err);
      });
  });

  it('should get /about', function(done) {
    request.get('/api/static/about')
      .expect(200)
      .end(function(err, res) {
        res.text.should.containEql('status');
        done(err);
      });
  });
});