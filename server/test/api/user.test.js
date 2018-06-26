const app = require('../../app');
const request = require('supertest').agent(app);
const should = require('should');
const support = require('../support');

describe('test/api/user', function() {
  let mockUser;

  before(function(done) {
    support
      .createUser({
        nickname: '青湛',
        mobile: 18800000000,
        password: 'a123456'
      }).then((user) => {
        mockUser = user;
        done();
      });
  });

  // 注册
  describe('post /api/signup', function() {
    // 手机号已经注册
    it('should fail when the mobile is registered', function(done) {
      request
        .post('/api/signup')
        .send({
          nickname: '小明',
          password: 'a123456',
          mobile: 18800000000,
          msgcaptcha: 123456
        })
        .end(function(err, res) {
          should.not.exist(err);
          res.body.status.should.equal(0);
          res.body.type.should.equal('MOBILE_HAS_BEEN_REGISTERED');
          res.body.message.should.equal('手机号已经注册过了');
          done();
        });
    });

    // 昵称已经注册
    it('should fail when nickname is registered', function(done) {
      request
        .post('/api/signup')
        .send({
          nickname: '青湛',
          password: 'a123456',
          mobile: 18800000001,
          msgcaptcha: 666666
        })
        .end(function(err, res) {
          should.not.exist(err);
          res.body.status.should.equal(0);
          res.body.type.should.equal('NICKNAME_HAS_BEEN_REGISTERED');
          res.body.message.should.equal('昵称已经注册过了');
          done();
        });
    });

    // 手机号验证失败
    it('should fail when mobile is not valid', function(done) {
      request
        .post('/api/signup')
        .send({
          nickname: '小明',
          password: 'a123456',
          mobile: 12345678912,
          msgcaptcha: 666666
        })
        .end(function(err, res) {
          should.not.exist(err);
          res.body.status.should.equal(0);
          res.body.type.should.equal('ERROR_PARMAS_SIGNUP');
          res.body.message.should.equal('请输入正确的手机号');
          done();
        });
    });

    // 密码验证失败
    it('should fail when password is not valid', function(done) {
      request
        .post('/api/signup')
        .send({
          nickname: '小明',
          password: '123456',
          mobile: 18800000001,
          msgcaptcha: 666666
        })
        .end(function(err, res) {
          should.not.exist(err);
          res.body.status.should.equal(0);
          res.body.type.should.equal('ERROR_PARMAS_SIGNUP');
          res.body.message.should.equal('密码必须为数字、字母和特殊字符其中两种组成并且在6-18位之间');
          done();
        });
    });

    // 昵称验证失败
    it('should fail when nickname is not valid', function(done) {
      request
        .post('/api/signup')
        .send({
          nickname: '小',
          password: 'a123456',
          mobile: 18800000001,
          msgcaptcha: 666666
        })
        .end(function(err, res) {
          should.not.exist(err);
          res.body.status.should.equal(0);
          res.body.type.should.equal('ERROR_PARMAS_SIGNUP');
          res.body.message.should.equal('请输入2-8位的名称');
          done();
        });
    });

    // 接收短信验证码的手机与填写的手机不匹配
    it('should fail when msgcaptcha and mobile do not match', function(done) {
      request
        .get('/api/captcha/msg')
        .query({
          mobile: 18800000001
        })
        .end(function(err, res) {
          should.not.exist(err);
          res.body.status.should.equal(1);
          request
            .post('/api/signup')
            .send({
              nickname: '小明',
              password: 'a123456',
              mobile: 18800000002,
              msgcaptcha: 666666
            })
            .end(function(err, res) {
              should.not.exist(err);
              res.body.status.should.equal(0);
              res.body.type.should.equal('ERROR_PARMAS_SIGNUP');
              res.body.message.should.equal('收取验证码的手机与登录手机不匹配');
              done();
            });
        });
    });

    // 短信验证码不正确
    it('should fail when msgcaptcha is not valid', function(done) {
      request
        .get('/api/captcha/msg')
        .query({
          mobile: 18800000001
        })
        .end(function(err, res) {
          should.not.exist(err);
          res.body.status.should.equal(1);
          request
            .post('/api/signup')
            .send({
              nickname: '小明',
              password: 'a123456',
              mobile: 18800000001,
              msgcaptcha: 666666
            })
            .end(function(err, res) {
              should.not.exist(err);
              res.body.status.should.equal(0);
              res.body.type.should.equal('ERROR_PARMAS_SIGNUP');
              res.body.message.should.equal('短信验证码不正确');
              done();
            });
        });
    });

    // 验证码过期
    it('should fail when msgcaptcha expired', function(done) {
      request
        .get('/api/captcha/msg')
        .query({
          mobile: 18800000001
        })
        .end(function(err, res) {
          should.not.exist(err);
          res.body.status.should.equal(1);
          setTimeout(function() {
            request
              .post('/api/signup')
              .send({
                nickname: '小明',
                password: 'a123456',
                mobile: 18800000001,
                msgcaptcha: res.body.code
              })
              .end(function(err, res) {
                should.not.exist(err);
                res.body.status.should.equal(0);
                res.body.type.should.equal('ERROR_PARMAS_SIGNUP');
                res.body.message.should.equal('短信验证码已经失效了，请重新获取');
                done();
              });
          }, 1000);
        });
    });

    // 正确的注册
    it('should return status 1', function(done) {
      request
        .get('/api/captcha/msg')
        .query({
          mobile: 18800000001
        })
        .end(function(err, res) {
          should.not.exist(err);
          res.body.status.should.equal(1);
          request
            .post('/api/signup')
            .send({
              nickname: '小明',
              password: 'a123456',
              mobile: 18800000001,
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
  

  after(function(done) {
    support
      .deleteUser(18800000000)
      .then(() => {
        support
          .deleteUser(18800000001)
          .then(() => {
            mockUser = null;
            done();
          });
      });
  });  
});