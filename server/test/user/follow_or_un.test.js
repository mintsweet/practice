const app = require('../../app');
const request = require('supertest').agent(app);
const should = require('should');
const support = require('../support');

describe('test /api/:uid/follow_or_un', function() {
  let user_1;
  let user_2;

  before(function(done) {
    support.createUser('测试一', '18800000000').then(function(res) {
      user_1 = res;
      support.createUser('测试二', '18800000001').then(function(res) {
        user_2 = res;
        done();
      });
    });
  });

  after(function(done) {
    support.deleteUser('18800000000').then(function() {
      support.deleteUser('18800000001').then(function() {
        done();
      });
    });
  });

  // 错误 - 尚未登录
  it('should return status 0 when the not signin in yet', function(done) {
    request
      .patch(`/api/user/${user_2._id}/follow_or_un`)
      .end(function(err, res) {
        should.not.exist(err);
        res.body.status.should.equal(0);
        res.body.type.should.equal('ERROR_NO_SIGNIN');
        res.body.message.should.equal('尚未登录');
        done();
      });
  });

  // 正确
  it('should return status 1', function(done) {
    request
      .post('/api/signin')
      .send({
        type: 'acc',
        mobile: user_1.mobile,
        password: 'a123456'
      })
      .end(function(err, res) {
        should.not.exist(err);
        res.body.status.should.equal(1);
        request
          .patch(`/api/user/${user_2._id}/follow_or_un`)
          .end(function(err, res) {
            should.not.exist(err);
            res.body.status.should.equal(1);
            done();
          });
      });
  });
});