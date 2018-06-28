const app = require('../../app');
const request = require('supertest')(app);
const should = require('should');

describe('test /api/captcha/msg', function() {
  it('should return status 0 when mobile is not valid', function(done) {
    request
      .get('/api/captcha/msg')
      .end(function(err, res) {
        should.not.exist(err);
        res.body.status.should.equal(0);
        res.body.type.should.equal('ERROR_MOBILE_IS_NOT_VALID');
        res.body.message.should.equal('手机号格式不正确');
        done();
      });
  });

  it('should return status 1', function(done) {
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