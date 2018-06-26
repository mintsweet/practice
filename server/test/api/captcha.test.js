const app = require('../../app');
const request = require('supertest')(app);
const should = require('should');

describe('test/api/captcha', function() {

  describe('get /api/captcha/pic', function() {
    it('should return piccatpcha', function(done) {
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

  describe('get /api/captcha/msg', function() {
    it('should fail when mobile is not valid', function(done) {
      request
        .get('/api/captcha/msg')
        .end(function(err, res) {
          should.not.exist(err);
          res.body.status.should.equal(0);
          res.body.type.should.equal('ERROR_MOBILE_FORMAT');
          done();
        });
    });

    it('should return msgcaptcha', function(done) {
      request
        .get('/api/captcha/msg')
        .query({
          mobile: '18800000000'
        })
        .end(function(err, res) {
          should.not.exist(err);
          res.body.status.should.equal(1);
          done();
        });
    });
  });

});