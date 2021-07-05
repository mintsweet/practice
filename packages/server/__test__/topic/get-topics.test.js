const app = require('../../app').listen();
const request = require('supertest')(app);
const should = require('should');
const support = require('../support');

describe('test /topics', function() {
  let mockUser;

  before(async function() {
    mockUser = await support.createUser('123456@qq.com');
    await support.createTopic(mockUser._id);
    await support.createTopic(mockUser._id);
  });

  after(async function() {
    await support.deleteUser(mockUser.email);
    await support.deleteTopic(mockUser._id);
  });

  it('should / status 200', async function() {
    try {
      const res = await request.get('/topics').expect(200);

      res.body.list.length.should.equal(2);
      res.body.total.should.equal(2);
    } catch (err) {
      should.ifError(err.message);
    }
  });
});
