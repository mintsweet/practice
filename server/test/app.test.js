const app = require('../app').listen();
const request = require('supertest')(app);
const should = require('should');

describe('test /app.test', function() {
  it('should / status 404', async function() {
    try {
      const res = await request.get('/not_found');

      res.status.should.equal(404);
      res.text.should.equal('请求的API地址不正确或者不存在');
    } catch(err) {
      should.ifError(err.message);
    }
  });

  it('should / status 200 when the v1', async function() {
    try {
      const res = await request.get('/v1');

      res.status.should.equal(200);
      res.text.should.equal('Version_1 API');
    } catch(err) {
      should.ifError(err.message);
    }
  });

  it('should / status 200 when the v2', async function() {
    try {
      const res = await request.get('/v2');

      res.status.should.equal(200);
      res.text.should.equal('Version_2 API');
    } catch(err) {
      should.ifError(err.message);
    }
  });
});
