const app = require('../app');
const request = require('supertest')(app);
const should = require('should');

describe('test /api', function() {
  it('should / status 0 when the 404', async function() {
    try {
      const res = await request.get('/not_found');

      res.body.status.should.equal(0);
      res.body.message.should.equal('找不到请求资源');
    } catch(err) {
      should.ifError(err.message);
    }
  });

  it('should / status 1', async function() {
    try {
      const res = await request.get('/api');

      res.body.status.should.equal(1);
      res.body.data.should.equal('欢迎使用 Mints - 薄荷糖社区 API接口');
    } catch(err) {
      should.ifError(err.message);
    }
  });
});
