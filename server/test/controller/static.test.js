const should = require('should');
const app = require('../../app');
const request = require('supertest')(app);

describe('test/controllers/static', function() {
  it('should get /get_start', function (done) {
    request.get('/static/get_start')
      .expect(200)
      .end(function (err, res) {
        done(err);
      });
  });
});