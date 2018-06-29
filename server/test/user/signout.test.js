const app = require('../../app');
const request = require('supertest').agent(app);
const should = require('should');
const support = require('../support');

describe('test /api/signout', function() {
  before(function(done) {
    support.createUser().then(() => {
      done();
    });
  });

  after(function(done) {
    support.deleteUser().then(() => {
      done();
    });
  });

  it('should return status 1', function(done) {
    request
      .post('/api/signin')
      .send({
        type: 'acc',
        mobile: '18800000000',
        password: 'a123456'
      })
      .end(function(err, res) {
        should.not.exist(err);
        res.body.status.should.equal(1);
        request
          .delete('/api/signout')
          .end(function(err, res) {
            should.not.exist(err);
            res.body.status.should.equal(1);
            done();
          });
      });
  });
});