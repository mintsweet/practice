const app = require('../../app');
const request = require('supertest').agent(app);
const should = require('should');
const support = require('../support');

describe('test /api/update_pass', function() {
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
  it('should return status 0 when the user is not signin', function(done) {
    request
      .patch('/api/update_pass')
      .send({
        oldPass: 'a123456',
        newPass: 'a123456789' 
      })
      .end(function(err, res) {
        should.not.exist(err);
        res.body.status.should.equal(0);
        res.body.type.should.equal('ERROR_NO_SIGNIN');
        res.body.message.should.equal('尚未登录');
        done();
      });
  });
  
  // 错误 - 旧密码不能为空
  it('should return status 0 when the oldPass is not valid', function(done) {
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
          .patch('/api/update_pass')
          .send({
            oldPass: '',
            newPass: 'a123456789' 
          })
          .end(function(err, res) {
            should.not.exist(err);
            res.body.status.should.equal(0);
            res.body.type.should.equal('ERROR_PARMAS_OF_UPDATE_PASS');
            res.body.message.should.equal('旧密码不能为空');
            done();
          });
      });
  });

  // 错误 - 新密码不能通过校验
  it('should return status 0 when the newPass is not valid', function(done) {
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
          .patch('/api/update_pass')
          .send({
            oldPass: 'a123456',
            newPass: '123456789' 
          })
          .end(function(err, res) {
            should.not.exist(err);
            res.body.status.should.equal(0);
            res.body.type.should.equal('ERROR_PARMAS_OF_UPDATE_PASS');
            res.body.message.should.equal('密码必须为数字、字母和特殊字符其中两种组成并且在6-18位之间');
            done();
          });
      });
  });

  // 错误 - 旧密码错误
  it('should return status 0 when the oldPass is not match', function(done) {
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
          .patch('/api/update_pass')
          .send({
            oldPass: '123456',
            newPass: 'a123456789' 
          })
          .end(function(err, res) {
            should.not.exist(err);
            res.body.status.should.equal(0);
            res.body.type.should.equal('ERROR_PASSWORD_IS_NOT_MATCH');
            res.body.message.should.equal('密码错误');
            done();
          });
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
        res.body.data.should.have.property('_id');
        request
          .patch('/api/update_pass')
          .send({
            oldPass: 'a123456',
            newPass: 'a123456789' 
          })
          .end(function(err, res) {
            should.not.exist(err);
            res.body.status.should.equal(1);
            done();
          });
      });
  });
});