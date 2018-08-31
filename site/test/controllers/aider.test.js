const app = require('../../app');
const request = require('supertest')(app);
const should = require('should');

describe('test /controllers/aider.test', function() {
  it('should get /aider/captcha', async function() {
    try {
      const res = await request.get('/aider/captcha').expect(200);

      res.body.status.should.equal(1);
      res.body.data.should.containEql('data');
    } catch(err) {
      should.ifError(err.message);
    }
  });

  it('should get /aider/sms_code', async function() {
    try {
      const res = await request.get('/aider/sms_code').query({
        mobile: '18800000000'
      }).expect(200);

      res.body.status.should.equal(1);
    } catch(err) {
      should.ifError(err.message);
    }
  });
});
