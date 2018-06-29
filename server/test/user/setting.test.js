const app = require('../../app');
const request = require('supertest').agent(app);
const should = require('should');
const support = require('../support');

describe('test /api/setting', function() {
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

  // 错误 - 尚未登录
  it('should return status 0 when user is not signin', function(done) {
    request
      .put('/api/setting')
      .send({
        nickname: '青湛',
        avatar: 'http://image.yujunren.com/avatar.jpg',
        location: '四川，成都',
        signature: '我是光'
      })
      .end(function(err, res) {
        should.not.exist(err);
        res.body.status.should.equal(0);
        res.body.type.should.equal('ERROR_NO_SIGNIN');
        res.body.message.should.equal('尚未登录');
        done();
      });
  });

  // 失败 - 昵称已经注册过了
  it('should return status 0 when nickname is registered', function(done) {
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
          .put('/api/setting')
          .send({
            nickname: '青湛',
            location: '四川，成都',
            signature: '我是光'
          })
          .end(function(err, res) {
            res.body.status.should.equal(0);
            res.body.type.should.equal('NICKNAME_HAS_BEEN_REGISTERED');
            res.body.message.should.equal('昵称已经注册过了');
            done();
          });
      });
  });

  // 成功
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
          .put('/api/setting')
          .send({
            nickname: '青湛改名',
            location: '四川，成都',
            signature: '我是光'
          })
          .end(function(err, res) {
            res.body.status.should.equal(1);
            done();
          });
      });
  });
});