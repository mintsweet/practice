const app = require('../../../app').listen();
const request = require('supertest')(app);
const should = require('should');

describe('test /v1/users/top100', function() {
  it('should / status 1', async function() {
    try {
      const res = await request.get('/v1/users/top100').expect(200);

      res.body.should.be.an.Array();
      res.body.length.should.equal(1);
    } catch(err) {
      should.ifError(err.message);
    }
  });
});
