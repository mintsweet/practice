const should = require('should');
const app = require('../../app');
const request = require('supertest')(app);

describe('test/api/static', function() {

  describe('get /api/static/get_start', function() {
    it('should return doc for get start', function(done) {
      request
        .get('/api/static/get_start')
        .end(function(err, res) {
          should.not.exist(err);
          res.body.status.should.equal(1);
          done(err);
        });
    });
  });

  describe('get /api/static/api_introduction', function() {
    it('should return doc for api introduction', function(done) {
      request
        .get('/api/static/api_introduction')
        .end(function(err, res) {
          should.not.exist(err);
          res.body.status.should.equal(1);
          done(err);
        });
    });
  });

  describe('get /api/static/about', function() {
    it('should return doc for about', function(done) {
      request
        .get('/api/static/about')
        .end(function(err, res) {
          should.not.exist(err);
          res.body.status.should.equal(1);
          done(err);
        });
    });
  });
});