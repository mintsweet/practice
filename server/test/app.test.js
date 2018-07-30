const app = require('../app').listen();
const request = require('supertest')(app);
const should = require('should');

describe('test /app.test', function() {
  // 404
  it('should / 404', async function() {
    try {
      const res = await request.get('/not_found');

      res.status.should.equal(404);
      res.text.should.equal('请求的API地址不正确或者不存在');
    } catch(err) {
      should.ifError(err.message);
    }
  });

  // v1
  it('should / v1 200', async function() {
    try {
      const res = await request.get('/v1');

      res.status.should.equal(200);
      res.text.should.equal('Version_1 API');
    } catch(err) {
      should.ifError(err.message);
    }
  });

  // v2
  it('should / v2 200', async function() {
    try {
      const res = await request.get('/v2');

      res.status.should.equal(200);
      res.text.should.equal('Version_2 API');
    } catch(err) {
      should.ifError(err.message);
    }
  });
});
