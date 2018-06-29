const app = require('../../app');
const request = require('supertest').agent(app);
const should = require('should');
const support = require('../support');
const sinon = require('sinon');

describe('test /api/forget_pass', function() {
  let clock;

  before(function(done) {
    clock = sinon.useFakeTimers();
    support.createUser().then(() => {
      done();
    });
  });

  after(function(done) {
    clock.restore();
    support.deleteUser().then(() => {
      done();
    });
  });

  // 错误 - 手机号格式不正确
  it('shuold return status 0 when the mobile is not valid', function(done) {
    request
      .patch('/api/forget_pass')
      .send({
        mobile: '12345678901',
        newPassword: 'a123456789',
        msgcaptcha: '123456'
      })
      .end(function(err, res) {
        should.not.exist(err);
        res.body.status.should.equal(0);
        res.body.type.should.equal('ERROR_PARMAS_OF_FORGET_PASS');
        res.body.message.should.equal('请输入正确的手机号');
        done();
      });
  });

  // 错误 - 新密码格式不正确
  it('shuold return status 0 when the newPassword is not valid', function(done) {
    request
      .patch('/api/forget_pass')
      .send({
        mobile: '18800000000',
        newPassword: '123456789',
        msgcaptcha: '123456'
      })
      .end(function(err, res) {
        should.not.exist(err);
        res.body.status.should.equal(0);
        res.body.type.should.equal('ERROR_PARMAS_OF_FORGET_PASS');
        res.body.message.should.equal('密码必须为数字、字母和特殊字符其中两种组成并且在6-18位之间');
        done();
      });
  });

  // 错误 - 提交手机号与获取验证码手机号不对应
  it('should return status 0 when the mobile and msgcaptcha\' mobile is not match', function(done) {
    request
      .get('/api/captcha/msg')
      .query({
        mobile: '18800000000'
      })
      .end(function(err, res) {
        should.not.exist(err);
        res.body.status.should.equal(1);
        res.body.code.length.should.equal(6);
        request
          .patch('/api/forget_pass')
          .send({
            mobile: '18800000001',
            newPassword: 'a123456789',
            msgcaptcha: '123456'
          })
          .end(function(err, res) {
            should.not.exist(err);
            res.body.status.should.equal(0);
            res.body.type.should.equal('ERROR_PARMAS_OF_FORGET_PASS');
            res.body.message.should.equal('提交手机号与获取验证码手机号不对应');
            done();
          });
      });
  });

  // 错误 - 验证码错误
  it('should return status 0 when the msgcaptcha is error ', function(done) {
    request
      .get('/api/captcha/msg')
      .query({
        mobile: '18800000000'
      })
      .end(function(err, res) {
        should.not.exist(err);
        res.body.status.should.equal(1);
        res.body.code.length.should.equal(6);
        request
          .patch('/api/forget_pass')
          .send({
            mobile: '18800000000',
            newPassword: 'a123456789',
            msgcaptcha: '123456'
          })
          .end(function(err, res) {
            should.not.exist(err);
            res.body.status.should.equal(0);
            res.body.type.should.equal('ERROR_PARMAS_OF_FORGET_PASS');
            res.body.message.should.equal('验证码错误');
            done();
          });
      });
  });

  // 错误 - 验证码失效
  it('should return status 0 when the msgcaptcha is expired', function(done) {
    request
      .get('/api/captcha/msg')
      .query({
        mobile: '18800000000'
      })
      .end(function(err, res) {
        should.not.exist(err);
        res.body.status.should.equal(1);
        res.body.code.length.should.equal(6);
        clock.tick(1000 * 60 * 11);
        request
          .patch('/api/forget_pass')
          .send({
            mobile: '18800000000',
            newPassword: 'a123456789',
            msgcaptcha: res.body.code
          })
          .end(function(err, res) {
            should.not.exist(err);
            res.body.status.should.equal(0);
            res.body.type.should.equal('ERROR_PARMAS_OF_FORGET_PASS');
            res.body.message.should.equal('验证码已失效，请重新获取');
            done();
          });
      });
  });

  // 错误 - 手机号尚未注册
  it('should return status 0 when the mobile is not signup', function(done) {
    request
      .get('/api/captcha/msg')
      .query({
        mobile: '18800000001'
      })
      .end(function(err, res) {
        should.not.exist(err);
        res.body.status.should.equal(1);
        res.body.code.length.should.equal(6);
        request
          .patch('/api/forget_pass')
          .send({
            mobile: '18800000001',
            newPassword: 'a123456789',
            msgcaptcha: res.body.code
          })
          .end(function(err, res) {
            should.not.exist(err);
            res.body.status.should.equal(0);
            res.body.type.should.equal('ERROR_MOBILE_IS_NOT_SIGNUP');
            res.body.message.should.equal('手机号尚未注册');
            done();
          });
      });
  });

  // 正确
  it('should return status 1', function(done) {
    request
      .get('/api/captcha/msg')
      .query({
        mobile: '18800000000'
      })
      .end(function(err, res) {
        should.not.exist(err);
        res.body.status.should.equal(1);
        res.body.code.length.should.equal(6);
        request
          .patch('/api/forget_pass')
          .send({
            mobile: '18800000000',
            newPassword: 'a123456789',
            msgcaptcha: res.body.code
          })
          .end(function(err, res) {
            should.not.exist(err);
            res.body.status.should.equal(1);
            done();
          });
      });
  });
});