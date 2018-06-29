const app = require('../../app');
const request = require('supertest').agent(app);
const shuold = require('should');
const support = require('../support');

describe('test /api/info', function() {
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

  it('should return status 0 when user is not signin', function(done) {
    request
      .get('/api/info')
      .end(function(err, res) {
        should.not.exist(err);
        res.body.status.should.equal(0);
        res.body.type.should.equal('ERROR_NO_SIGNIN');
        res.body.message.should.equal('尚未登录');
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
          .get('/api/info')
          .end(function(err, res) {
            should.not.exist(err);
            res.body.status.should.equal(1);
            res.body.data.should.have.property('_id');
            done();
          });
      });
  });
});