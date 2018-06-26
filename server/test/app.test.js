const app = require('../app');
const request = require('supertest')(app);
const should = require('should');

describe('test/app.test.js', function() {
  it('should corrent link api service', function(done) {
    request
      .get('/api')
      .end(function(err, res) {
        should.not.exist(err);
        res.body.status.should.equal(1);
        res.body.data.should.containEql('欢迎使用Mints(薄荷糖社区)API接口')
        done();
      });
  });
});