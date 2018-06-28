const app = require('../app');
const request = require('supertest')(app);
const should = require('should');

describe('test /api', function() {
  it('should return status 1', function(done) {
    request
      .get('/api')
      .end(function(err, res) {
        should.not.exist(err);
        res.body.status.should.equal(1);
        res.body.data.should.equal('欢迎使用 Mints - 薄荷糖社区 API接口')
        done();
      });
  });
});