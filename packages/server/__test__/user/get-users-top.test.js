const app = require('../../app').listen();
const request = require('supertest')(app);
const should = require('should');
const support = require('../support');

describe('test /users/top', function() {
  before(async function() {
    await support.createUser('123456@qq.com');
    await support.createUser('123457@qq.com');
  });

  after(async function() {
    await support.deleteUser('123456@qq.com');
    await support.deleteUser('123457@qq.com');
  });

  it('should / status 200 when it has params', async function() {
    try {
      const res = await request
        .get('/users/top')
        .query({
          count: 1,
        })
        .expect(200);

      res.body.should.be.an.Array();
      res.body.length.should.equal(1);
    } catch (err) {
      should.ifError(err.message);
    }
  });

  it('should / status 200', async function() {
    try {
      const res = await request.get('/users/top').expect(200);

      res.body.should.be.an.Array();
      res.body.length.should.equal(2);
    } catch (err) {
      should.ifError(err.message);
    }
  });
});
