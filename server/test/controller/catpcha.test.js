const should = require('should');
const app = require('../../app');
const request = require('supertest')(app);

describe('test/controllers/catpcha', function() {
  describe('#getPicCatpcha', function() {
    it('should get pic catpcha', function(done) {
      request.get('/info')
        .expect(200, function(err, res) {
          console.log(err)
          // res.status.should.containEql(1);
        });
      done(err);
    });
  });
});