const app = require('../app');
const request = require('supertest')(app);
const should = require('should');
const config = require('../../config.default');

describe('test /app.test.js', function() {
  // 错误 - 无效的页面
  it('should / status 404', async function() {
    try {
      const res = await request.get('/not_found');
      res.status.should.equal(404);
      res.text.should.containEql('404');
    } catch(err) {
      should.not.exist(err);
    }
  });

  // 正确
  it('should / status 200', async function() {
    try {
      const res = await request.get('/');
      res.status.should.equal(200);
      res.text.should.containEql(config.description);
    } catch(err) {
      should.not.exist(err);
    }
  });
});
