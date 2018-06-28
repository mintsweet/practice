const app = require('../../app');
const request = require('supertest')(app);
const should = require('should');
const support = require('../support');
const sinon = require('sinon');

describe('test /api/forget_pass', function() {
  let clock;

  before(function(done) {
    clock = sinon.useFakeTimers();

    support
      .createUser({
        nickname: '青湛',
        mobile: '18800000000',
        password: 'a123456'
      }).then(() => {
        done();
      });
  });

  after(function(done) {
    clock.restore();

    support
      .deleteUser('18800000000')
      .then(() => {
        done();
      });
  });

  // 提交手机号与获取验证码手机号不对应
  it('should return status 0 when mobile and msgcaptcha\' mobile is not match ', function(done) {
    request
      .get('/api/captcha/msg')
      .query({
        mobile: '18800000000'
      })
      .end(function(err, res) {
        should.not.exist(err);
        res.body.status.should.equal(1);
        res.body.data.length.should.equal(6);
        request
          .post('/api/forget_pass')
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
});