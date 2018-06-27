const app = require('../../app');
const request = require('supertest').agent(app);
const should = require('should');
const support = require('../support');
const sinon = require('sinon');

describe('test/api/user', function() {
  let mockUser;
  let clock;

  before(function(done) {
    support
      .createUser({
        nickname: '青湛',
        mobile: '18800000000',
        password: 'a123456'
      }).then((user) => {
        mockUser = user;
        done();
      });
  });

  beforeEach(function() {
    clock = sinon.useFakeTimers();
  });

  afterEach(function() {
    clock.restore();
  });

  after(function(done) {
    support
      .deleteUser('18800000000')
      .then(() => {
        support
          .deleteUser('18800000001')
          .then(() => {
            mockUser = null;
            done();
          });
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
          mobile: '18800000000',
          msgcaptcha: '123456'
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
    it('should fail when the nickname is registered', function(done) {
      request
        .post('/api/signup')
        .send({
          nickname: '青湛',
          password: 'a123456',
          mobile: '18800000001',
          msgcaptcha: '666666'
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
    it('should fail when the mobile is not valid', function(done) {
      request
        .post('/api/signup')
        .send({
          nickname: '小明',
          password: 'a123456',
          mobile: '12345678912',
          msgcaptcha: '666666'
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
    it('should fail when the password is not valid', function(done) {
      request
        .post('/api/signup')
        .send({
          nickname: '小明',
          password: '123456',
          mobile: '18800000001',
          msgcaptcha: '666666'
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
    it('should fail when the nickname is not valid', function(done) {
      request
        .post('/api/signup')
        .send({
          nickname: '小',
          password: 'a123456',
          mobile: '18800000001',
          msgcaptcha: '666666'
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
    it('should fail when the msgcaptcha and mobile do not match', function(done) {
      request
        .get('/api/captcha/msg')
        .query({
          mobile: '18800000001'
        })
        .end(function(err, res) {
          should.not.exist(err);
          res.body.status.should.equal(1);
          request
            .post('/api/signup')
            .send({
              nickname: '小明',
              password: 'a123456',
              mobile: '18800000002',
              msgcaptcha: '666666'
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
    it('should fail when the msgcaptcha is not valid', function(done) {
      request
        .get('/api/captcha/msg')
        .query({
          mobile: '18800000001'
        })
        .end(function(err, res) {
          should.not.exist(err);
          res.body.status.should.equal(1);
          request
            .post('/api/signup')
            .send({
              nickname: '小明',
              password: 'a123456',
              mobile: '18800000001',
              msgcaptcha: '666666'
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
    it('should fail when the msgcaptcha expired', function(done) {
      request
        .get('/api/captcha/msg')
        .query({
          mobile: '18800000001'
        })
        .end(function(err, res) {
          should.not.exist(err);
          res.body.status.should.equal(1);
          clock.tick(1000 * 60 * 11);
          request
            .post('/api/signup')
            .send({
              nickname: '小明',
              password: 'a123456',
              mobile: '18800000001',
              msgcaptcha: res.body.code
            })
            .end(function(err, res) {
              should.not.exist(err);
              res.body.status.should.equal(0);
              res.body.type.should.equal('ERROR_PARMAS_SIGNUP');
              res.body.message.should.equal('短信验证码已经失效了，请重新获取');
              done();
            });
        });
    });

    // 正确的注册
    it('should success', function(done) {
      request
        .get('/api/captcha/msg')
        .query({
          mobile: '18800000001'
        })
        .end(function(err, res) {
          should.not.exist(err);
          res.body.status.should.equal(1);
          request
            .post('/api/signup')
            .send({
              nickname: '小明',
              password: 'a123456',
              mobile: '18800000001',
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

  // 登录 
  describe('post /api/signin', function() {
    // 登录方式不正确
    it('should fail when the acc is not valid', function(done) {
      request
        .post('/api/signin')
        .send({
          type: 'lala',
          mobile: '18800000000',
          password: 'a123456'
        })
        .end(function(err, res) {
          should.not.exist(err);
          res.body.status.should.equal(0);
          res.body.type.should.equal('ERROR_SIGNIN_PARMAS');
          res.body.message.should.equal('请输入正确的登录方式');
          done();
        });
    });

    // 手机号是否正确
    it('should fail when the mobile is not valid', function(done) {
      request
        .post('/api/signin')
        .send({
          type: 'acc',
          mobile: '12345678901',
          password: 'a123456'
        })
        .end(function(err, res) {
          should.not.exist(err);
          res.body.status.should.equal(0);
          res.body.type.should.equal('ERROR_SIGNIN_PARMAS');
          res.body.message.should.equal('请输入正确的手机号');
          done();
        });
    });

    // 账户是否存在
    it('should fail when the mobile is not registered', function(done) {
      request
        .post('/api/signin')
        .send({
          type: 'acc',
          mobile: '18800000002',
          password: 'a123456'
        })
        .end(function(err, res) {
          should.not.exist(err);
          res.body.status.should.equal(0);
          res.body.type.should.equal('ERROR_USER_IS_NOT_EXITS');
          res.body.message.should.equal('手机账户尚未注册');
          done();
        });
    });

    // 登录类型为账户密码 - 密码错误
    it('should fail when the pass is not match', function(done) {
      request
        .post('/api/signin')
        .send({
          type: 'acc',
          mobile: '18800000000',
          password: 'a123456789'
        })
        .end(function(err, res) {
          should.not.exist(err);
          res.body.status.should.equal(0);
          res.body.type.should.equal('ERROR_PASS_IS_NOT_MATCH');
          res.body.message.should.equal('用户密码错误');
          done();
        });
    });

    // 登录类型为账户密码 - 正确
    it('should success', function(done) {
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
          done();
        });
    });

    // 登录类型为短信验证码 - 收取验证码手机与登录手机不匹配
    it('should fail when the msgcaptcha and mobile is not match', function(done) {
      request
        .get('/api/captcha/msg')
        .query({
          mobile: '18800000000'
        })
        .end(function(err, res) {
          should.not.exist(err);
          res.body.status.should.equal(1);
          request
            .post('/api/signin')
            .send({
              type: 'mct',
              mobile: '18800000001',
              msgcaptcha: '123456'
            })
            .end(function(err, res) {
              should.not.exist(err);
              res.body.status.should.equal(0);
              res.body.type.should.equal('ERROR_MSG_CAPTCHA');
              res.body.message.should.equal('收取验证码的手机与登录手机不匹配');
              done();
            });
        });
    });

    // 登录类型为短信验证码 - 短信验证码不对
    it('should fail when the msgcaptcha is not valid', function(done) {
      request
        .get('/api/captcha/msg')
        .query({
          mobile: '18800000000'
        })
        .end(function(err, res) {
          should.not.exist(err);
          res.body.status.should.equal(1);
          request
            .post('/api/signin')
            .send({
              type: 'mct',
              mobile: '18800000000',
              msgcaptcha: '123456'
            })
            .end(function(err, res) {
              should.not.exist(err);
              res.body.status.should.equal(0);
              res.body.type.should.equal('ERROR_MSG_CAPTCHA');
              res.body.message.should.equal('短信验证码不正确');
              done();
            });
        });
    });

    // 登录类型为短信验证码 - 短信验证码失效
    it('should fail when the msgcaptcha is expired', function(done) {
      request
        .get('/api/captcha/msg')
        .query({
          mobile: '18800000001'
        })
        .end(function(err, res) {
          should.not.exist(err);
          res.body.status.should.equal(1);
          clock.tick(1000 * 60 * 11);
          request
            .post('/api/signin')
            .send({
              type: 'mct',
              mobile: '18800000001',
              msgcaptcha: res.body.code
            })
            .end(function(err, res) {
              should.not.exist(err);
              res.body.status.should.equal(0);
              res.body.type.should.equal('ERROR_MSG_CAPTCHA');
              res.body.message.should.equal('短信验证码已经失效了，请重新获取');
              done();
            });
        });
    });

    // 登录类型为短信验证码 - 登录成功
    it('should success', function(done) {
      request
        .get('/api/captcha/msg')
        .query({
          mobile: '18800000000'
        })
        .end(function(err, res) {
          should.not.exist(err);
          res.body.status.should.equal(1);
          request
            .post('/api/signin')
            .send({
              type: 'mct',
              mobile: '18800000000',
              msgcaptcha: res.body.code
            })
            .end(function(err, res) {
              should.not.exist(err);
              res.body.status.should.equal(1);
              res.body.data.should.have.property('_id');
              done();
            });
        });
    });
  });
});