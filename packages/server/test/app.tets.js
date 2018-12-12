const app = require('../app').listen();
const request = require('supertest')(app);
const should = require('should');

describe('test /app.js', function() {
  it('should / status 200', async function() {
    try {
      const res = await request.get('/').expect(404);
      res.text.should.equal('请求的API地址不正确或者不存在');
    } catch(err) {
      should.ifError(err.message);
    }
  });
});
