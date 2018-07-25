const app = require('../../../app').listen();
const request = require('supertest')(app);
const should = require('should');

describe('test /v1/captcha/sms', function() {
  it('should / 400 when the mobile is invalid', async function() {
    try {
      const res = await request.get('/v1/captcha/sms');
      res.status.should.equal(400);
      res.error.text.should.equal('手机号格式不正确');
    } catch(err) {
      should.ifError(err.message);
    }
  });

  it('should / 200', async function() {
    try {
      const res = await request.get('/v1/captcha/sms').query({
        mobile: 18800000000
      });
      res.status.should.equal(200);
      res.text.length.should.equal(6);
    } catch(err) {
      should.ifError(err.message);
    }
  });
});
