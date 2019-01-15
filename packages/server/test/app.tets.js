const app = require('../app').listen();
const request = require('supertest')(app);
const should = require('should');

describe('test /app.js', function() {
  it('should / status 404', async function() {
    try {
      const res = await request
        .get('/')
        .expect(404);

      res.text.should.equal('请求的API地址不正确或者不存在');
    } catch(err) {
      should.ifError(err.message);
    }
  });

  it('should / status 500', async function() {
    try {
      const res = await request
        .get('/v1/error')
        .expect(500);

      res.text.should.equal('错误测试覆盖');
    } catch(err) {
      should.ifError(err.message);
    }
  });

  it('should / status 200', async function() {
    try {
      const res = await request
        .get('/v1')
        .expect(200);

      res.text.should.equal('Version_1 API');
    } catch(err) {
      should.ifError(err.message);
    }
  });

  it('should/ status 200', async function() {
    try {
      const res = await request
        .get('/v2')
        .expect(200);

      res.text.should.equal('Version_2 API');
    } catch(err) {
      should.ifError(err.message);
    }
  });
});
