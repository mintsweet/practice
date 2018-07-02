const app = require('../../app');
const request = require('supertest')(app);
const should = require('should');

describe('test /api/captcha/sms', function() {
  // 错误 - 手机号格式不正确
  it('should return status 0 when mobile is invalid', async function() {
    try {
      const res = await request.get('/api/captcha/sms');
      res.body.status.should.equal(0);
      res.body.type.should.equal('ERROR_MOBILE_IS_INVALID');
      res.body.message.should.equal('手机号格式不正确');
    } catch(err) {
      should.ifError(err.message);
    }
  });

  // 正确
  it('should return status 1', async function() {
    try {
      const res = await request.get('/api/captcha/sms').query({
        mobile: '13500000000'
      });
      res.body.status.should.equal(1);
    } catch(err) {
      should.ifError(err.message);
    }
  });
});
