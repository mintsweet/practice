const app = require('../../app');
const request = require('supertest')(app);
const should = require('should');

describe('test /api/users/star', function() {
  // 正确
  it('should return status 1', function(done) {
    request
      .get('/api/users/star')
      .end(function(err, res) {
        should.not.exist(err);
        res.body.status.should.equal(1);
        res.body.data.should.be.an.Array();
        done();
      });
  });
});