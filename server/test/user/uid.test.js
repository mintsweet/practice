const app = require('../../app');
const request = require('supertest')(app);
const should = require('should');
const support = require('../support');

describe('test /api/users/:uid', function() {
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


  // 错误 - 用户不存在
  it('should return status 0 when uid is not valid', function(done) {
    request
      .get('/api/user/5b35f7c15b24e37bf0eb473f')
      .end(function(err, res) {
        should.not.exist(err);
        res.body.status.should.equal(0);
        res.body.type.should.equal('ERROR_USER_NOT_EXSIT');
        res.body.message.should.equal('用户不存在');
        done();
      });
  });

  // 正确
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
        res.body.data.should.have.property('_id');
        request
          .get(`/api/user/${res.body.data._id}`)
          .end(function(err, res) {
            should.not.exist(err);
            res.body.status.should.equal(1);
            res.body.data.should.have.property('_id');
            done();
          });
      });
  });
});