const app = require('../../app');
const request = require('supertest')(app);
const should = require('should');

describe('test /v1/aider/sms_code', function() {
  it('should / status 0 when mobile is invalid', async function() {
    try {
      const res = await request.get('/v1/aider/sms_code');

      res.body.status.should.equal(0);
      res.body.message.should.equal('手机号格式不正确');
    } catch(err) {
      should.ifError(err.message);
    }
  });

  // 正确
  it('should / status 1', async function() {
    try {
      const res = await request.get('/v1/aider/sms_code').query({
        mobile: 18800000000
      });

      res.body.status.should.equal(1);
      res.body.code.length.should.equal(6);
    } catch(err) {
      should.ifError(err.message);
    }
  });
});
