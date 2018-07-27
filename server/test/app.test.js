const app = require('../app');
const request = require('supertest')(app);
const should = require('should');

describe('test /v1', function() {
  // 404
  it('should / status 0 when the 404', async function() {
    try {
      const res = await request.get('/v1/not_found');

      res.body.status.should.equal(0);
      res.body.message.should.equal('找不到请求资源');
    } catch(err) {
      should.ifError(err.message);
    }
  });

  // 错误测试
  it('should / status 0 when the something wrong', async function() {
    try {
      const res = await request.get('/v1/error_test');

      res.body.status.should.equal(0);
      res.body.message.should.equal('随便出了错');
    } catch(err) {
      should.ifError(err.message);
    }
  });

  // 正确
  it('should / status 1', async function() {
    try {
      const res = await request.get('/v1');

      res.body.status.should.equal(1);
    } catch(err) {
      should.ifError(err.message);
    }
  });
});
