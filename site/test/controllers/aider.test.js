const app = require('../../app');
const request = require('supertest')(app);
const should = require('should');
const sinon = require('sinon');

describe('test /controllers/aider.test', function() {
  let clock;

  before(function() {
    clock = sinon.useFakeTimers();
  });

  after(function() {
    clock.restore();
  });

  it('should get /aider/captcha', async function() {
    try {
      const res = await request.get('/aider/captcha').expect(200);

      res.body.status.should.equal(1);
      res.body.data.url.should.containEql('data');
    } catch(err) {
      should.ifError(err.message);
    }
  });

  it('should get /aider/sms_code', async function() {
    try {
      let res = await request.get('/aider/cpatcha').expect(200);

      res = await request.get('/aider/sms_code').query({
        mobile: '18800000000',
        piccaptcha: 'TESTA'
      }).expect(200);

      res.body.status.should.equal(0);
      res.body.message.should.equal('图形验证码不正确');
    } catch(err) {
      should.ifError(err.message);
    }
  });

  it('should get /aider/sms_code', async function() {
    try {
      let res = await request.get('/aider/captcha').expect(200);

      clock.tick(1000 * 60 * 11);

      res = await request.get('/aider/sms_code').query({
        mobile: '18800000000',
        piccaptcha: res.body.data.token
      }).expect(200);

      res.body.status.should.equal(0);
      res.body.message.should.equal('图形验证码已过期');
    } catch(err) {
      should.ifError(err.message);
    }
  });

  it('should get /aider/sms_code', async function() {
    try {
      let res = await request.get('/aider/captcha').expect(200);

      res = await request.get('/aider/sms_code').query({
        mobile: '18800000000',
        piccaptcha: res.body.data.token
      }).expect(200);

      res.body.status.should.equal(1);
    } catch(err) {
      should.ifError(err.message);
    }
  });
});
