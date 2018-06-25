const should = require('should');
const app = require('../../app');
const request = require('supertest')(app);

describe('test/controllers/user', function() {
  describe('#getUserInfo', function() {
    it('should get user info', function(done) {
      request.get('/info')
        .expect(200, function(err, res) {
          res.status.should.containEql(1);
        });
      done(err);
    });
  });
});